const { execSync } = require('child_process');
const path = require('path');
const bcrypt = require('bcryptjs');
const prisma = require('./config/db');
const { seedPromotions } = require('../prisma/promotions');

async function waitForDatabase(retries = 10, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection established.');
      return true;
    } catch (err) {
      console.log(`⏳ Database not ready yet (attempt ${i}/${retries}). Retrying in ${delay / 1000}s...`);
      if (i === retries) {
        console.error('❌ Could not connect to database after maximum retries:', err.message);
        return false;
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  return false;
}

async function start() {
  console.log('🚀 Initializing GadgetZone Backend...');

  const dbReady = await waitForDatabase();

  if (dbReady) {
    // 1. Sync database schema
    try {
      console.log('📦 Pushing Prisma schema to database...');
      execSync('npx prisma db push --accept-data-loss', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
      });
      console.log('✅ Prisma schema pushed successfully.');
    } catch (err) {
      console.error('⚠️ Warning: Prisma db push encountered an issue:', err.message);
    }

    // 2. Ensure Admin and Demo Accounts exist
    try {
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gadgetzone.com').toLowerCase().trim();
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

      await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
          password: hashedAdminPassword,
          role: 'ADMIN',
          isActive: true,
        },
        create: {
          name: 'LHQ BANGLADESH Admin',
          email: adminEmail,
          password: hashedAdminPassword,
          phone: '01348178750',
          address: 'Konapara Shopping Complex, Dhaka, Ground Floor',
          role: 'ADMIN',
          isActive: true,
        },
      });
      console.log(`👑 Admin account ready: ${adminEmail}`);

      // Seed customer
      const customerEmail = 'customer@example.com';
      const customerPassword = await bcrypt.hash('Customer@123', 12);
      await prisma.user.upsert({
        where: { email: customerEmail },
        update: {},
        create: {
          name: 'Rahim Ahmed',
          email: customerEmail,
          password: customerPassword,
          phone: '+8801812345678',
          address: 'House 12, Road 5, Dhanmondi, Dhaka',
          role: 'CUSTOMER',
          isActive: true,
        },
      });

      // 3. Seed initial products if catalog is empty
      const count = await prisma.product.count();
      if (count === 0) {
        console.log('🌱 No products detected. Running initial seed script...');
        try {
          execSync('node prisma/seed.js', {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit',
          });
          console.log('✅ Catalog seeded successfully.');
        } catch (seedErr) {
          console.error('⚠️ Seed script error:', seedErr.message);
        }
      } else {
        console.log(`📦 Catalog contains ${count} active products.`);
      }

      // 4. Ensure storefront promotions exist (hero ad banners + flash sale)
      try {
        await seedPromotions(prisma);
      } catch (promoError) {
        console.error('⚠️ Promotion seed error:', promoError.message);
      }
    } catch (seedError) {
      console.error('⚠️ User verification / seed error:', seedError);
    }
  } else {
    console.warn('⚠️ Starting server without database sync. Please verify DATABASE_URL.');
  }

  // 4. Start Express HTTP Server
  require('./server');
}

start();
