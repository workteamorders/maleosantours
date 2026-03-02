const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const p = new PrismaClient();

(async () => {
  const admin = await p.admin.findUnique({ where: { email: 'admin@maleosan.com' } });
  if (!admin) { console.log('No admin!'); await p.$disconnect(); return; }

  // Create a 7-day session directly
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await p.session.create({
    data: { adminId: admin.id, token, expiresAt }
  });

  console.log('Session created!');
  console.log('Token:', token);
  console.log('Expires:', expiresAt.toISOString());
  console.log('');
  console.log('To set in browser, open DevTools Console and run:');
  console.log(`document.cookie = "admin_session=${token}; path=/; max-age=${7*24*60*60}";`);
  
  await p.$disconnect();
})();
