const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();

(async () => {
  const admin = await p.admin.findUnique({ where: { email: 'admin@maleosan.com' } });
  if (!admin) {
    console.log('Admin not found!');
    await p.$disconnect();
    return;
  }
  
  const match = await bcrypt.compare('password123', admin.password);
  console.log('Password "password123" matches:', match);
  
  if (!match) {
    // Reset password
    const newHash = await bcrypt.hash('password123', 12);
    await p.admin.update({ where: { id: admin.id }, data: { password: newHash } });
    console.log('Password reset to "password123"');
  }

  // Clean expired sessions
  const deleted = await p.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  console.log('Cleaned', deleted.count, 'expired sessions');

  await p.$disconnect();
})();
