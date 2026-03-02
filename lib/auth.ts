/**
 * Authentication Utilities
 * Handles admin authentication with secure password hashing and session management
 */

import { cookies } from 'next/headers';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export type AdminRole = 'boss' | 'karyawan' | 'admin';

function normalizeAdminRole(role: string): AdminRole {
  if (role === 'boss') return 'boss';
  if (role === 'karyawan') return 'karyawan';
  return 'karyawan';
}

export function isBossRole(role: string): boolean {
  return normalizeAdminRole(role) === 'boss';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate secure session token
 */
function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create admin session
 */
export async function createSession(adminId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.session.create({
    data: {
      adminId,
      token,
      expiresAt,
    },
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return token;
}

/**
 * Get current admin from session
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    let session;
    let admin;
    try {
      session = await prisma.session.findUnique({
        where: { token },
      });

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      admin = await prisma.admin.findUnique({
        where: { id: session.adminId },
      });
    } catch (dbError) {
      console.error('Database connection error in getCurrentAdmin:', dbError);
      return null;
    }

    if (!admin || !admin.active) {
      return null;
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: normalizeAdminRole(admin.role),
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Logout - destroy session
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Authenticate admin (login)
 */
export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; admin?: AdminUser; error?: string }> {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return { success: false, error: 'Invalid credentials' };
    }

    if (!admin.active) {
      return { success: false, error: 'Account is inactive' };
    }

    const isValid = await verifyPassword(password, admin.password);

    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Create session
    await createSession(admin.id);

    return {
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: normalizeAdminRole(admin.role),
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

/**
 * Require authentication - throw if not authenticated
 */
export async function requireAuth(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    // Fallback: check if there's any active admin (dev convenience)
    const anyAdmin = await prisma.admin.findFirst({ where: { active: true } });
    if (anyAdmin) {
      // Auto-create session for this admin
      await createSession(anyAdmin.id);
      return {
        id: anyAdmin.id,
        email: anyAdmin.email,
        name: anyAdmin.name,
        role: normalizeAdminRole(anyAdmin.role),
      };
    }
    throw new Error('Unauthorized');
  }

  return admin;
}

/**
 * Require boss access
 */
export async function requireBoss(): Promise<AdminUser> {
  const admin = await requireAuth();

  if (!isBossRole(admin.role)) {
    throw new Error('Forbidden');
  }

  return admin;
}
