const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const admins = await p.admin.findMany({ select: { id: true, email: true, name: true, active: true } });
  console.log('Admins:', JSON.stringify(admins, null, 2));

  const sessions = await p.session.findMany({ select: { id: true, adminId: true, token: true, expiresAt: true } });
  console.log('Sessions:', sessions.map(s => ({
    id: s.id,
    adminId: s.adminId,
    token: s.token.substring(0, 10) + '...',
    expiresAt: s.expiresAt,
    expired: s.expiresAt < new Date()
  })));

  await p.$disconnect();
})();
