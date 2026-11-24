const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');
const { seedPromotions } = require('./promotions');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GadgetZone Database...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gadgetzone.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'LHQ BANGLADESH Admin',
      email: adminEmail,
      password: hashedAdminPassword,
      phone: '01348178750',
      address: 'Konapara Shopping Complex, Dhaka, Ground Floor',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // Seed Demo Customer
  const customerEmail = 'customer@example.com';
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {},
    create: {
      name: 'Rahim Ahmed',
      email: customerEmail,
      password: customerPassword,
      phone: '+8801812345678',
      address: 'House 12, Road 5, Dhanmondi, Dhaka',
      role: 'CUSTOMER',
    },
  });
  console.log(`✅ Demo customer seeded: ${customer.email}`);

  // 2. Seed Categories
  const categoriesData = [
    {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Latest high-performance smartphones and flagships in Bangladesh',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Earbuds',
      slug: 'earbuds',
      description: 'True Wireless Stereo (TWS), ANC earbuds and hi-fi audio',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Smartwatches',
      slug: 'smartwatches',
      description: 'Fitness trackers, AMOLED displays, and advanced health monitors',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Power Banks',
      slug: 'power-banks',
      description: 'Fast charging high capacity portable power banks and chargers',
      image: 'https://images.pexels.com/photos/34338614/pexels-photo-34338614.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = record;
  }
  console.log('✅ Categories seeded');

  // 3. Seed Products
  const productsData = [
    // Smartphones
    {
      name: 'Samsung Galaxy A55 5G (8GB/128GB)',
      slug: 'samsung-galaxy-a55-5g',
      description: 'Super AMOLED 120Hz display, Exynos 1480 processor, 50MP OIS camera, 5000mAh battery with 25W fast charging. IP67 dust and water resistance.',
      price: 49999,
      comparePrice: 54999,
      stock: 25,
      sku: 'SAM-A55-128',
      categoryId: categories['smartphones'].id,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro+ 5G (12GB/512GB)',
      slug: 'xiaomi-redmi-note-13-pro-plus',
      description: '200MP OIS ultra-clear camera, 1.5K 120Hz curved AMOLED, MediaTek Dimensity 7200-Ultra, 120W HyperCharge with 5000mAh battery.',
      price: 45999,
      comparePrice: 48999,
      stock: 18,
      sku: 'MI-RN13P-512',
      categoryId: categories['smartphones'].id,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Apple iPhone 15 Pro (128GB - Natural Titanium)',
      slug: 'apple-iphone-15-pro-128gb',
      description: 'Forged in titanium, A17 Pro chip, Action button, 48MP main camera system with 3x Telephoto, USB-C support with USB 3 speeds.',
      price: 139999,
      comparePrice: 149999,
      stock: 10,
      sku: 'APL-IP15P-128',
      categoryId: categories['smartphones'].id,
      isFeatured: true,
      images: [
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
    },
    {
      name: 'OnePlus Nord CE 4 (8GB/256GB)',
      slug: 'oneplus-nord-ce-4',
      description: 'Snapdragon 7 Gen 3, 100W SUPERVOOC charging, 5500mAh massive battery, 120Hz Fluid AMOLED display with Aqua Touch.',
      price: 32999,
      comparePrice: 35999,
      stock: 30,
      sku: 'OP-NCE4-256',
      categoryId: categories['smartphones'].id,
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
      ],
    },

    // Earbuds
    {
      name: 'Apple AirPods Pro (2nd Generation with USB-C)',
      slug: 'apple-airpods-pro-2nd-gen',
      description: 'H2 chip, Up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, and MagSafe Charging Case (USB-C).',
      price: 29500,
      comparePrice: 32000,
      stock: 20,
      sku: 'APL-APP2-USBC',
      categoryId: categories['earbuds'].id,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Samsung Galaxy Buds2 Pro',
      slug: 'samsung-galaxy-buds2-pro',
      description: '24-bit Hi-Fi audio, Intelligent 360 Audio, enhanced ANC with 3 high SNR microphones, ergonomic fit for ultimate comfort.',
      price: 17500,
      comparePrice: 19999,
      stock: 22,
      sku: 'SAM-BUDS2P-GR',
      categoryId: categories['earbuds'].id,
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'realme Buds Air 5 Pro ANC Earbuds',
      slug: 'realme-buds-air-5-pro',
      description: '50dB Active Noise Cancellation, 4000Hz Ultra-wide Band Noise Cancellation, Hi-Res Audio Wireless certification with LDAC support.',
      price: 6850,
      comparePrice: 7500,
      stock: 45,
      sku: 'RLM-BA5P-BL',
      categoryId: categories['earbuds'].id,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'SoundPEATS Air4 Pro Adaptive Hybrid ANC',
      slug: 'soundpeats-air4-pro',
      description: 'Snapdragon Sound with aptX Lossless, 13mm dynamic driver, 6-mic cVc call noise reduction, multipoint connection.',
      price: 4950,
      comparePrice: 5500,
      stock: 50,
      sku: 'SP-AIR4P-BK',
      categoryId: categories['earbuds'].id,
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      ],
    },

    // Smartwatches
    {
      name: 'Apple Watch Series 9 GPS 45mm',
      slug: 'apple-watch-series-9-45mm',
      description: 'S9 SiP chip, magical Double Tap gesture, 2000 nits brighter display, on-device Siri, blood oxygen and ECG monitoring.',
      price: 52000,
      comparePrice: 56000,
      stock: 12,
      sku: 'APL-AWS9-45',
      categoryId: categories['smartwatches'].id,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Samsung Galaxy Watch 6 Classic 47mm',
      slug: 'samsung-galaxy-watch-6-classic-47mm',
      description: 'Rotating physical bezel, Sapphire Crystal glass, advanced sleep coaching, BIA body composition analysis, heart rate alerts.',
      price: 36500,
      comparePrice: 39999,
      stock: 15,
      sku: 'SAM-GW6C-47',
      categoryId: categories['smartwatches'].id,
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Amazfit GTR 4 Smartwatch with Dual-Band GPS',
      slug: 'amazfit-gtr-4-smartwatch',
      description: '1.43" HD AMOLED display, Dual-band circularly-polarized GPS antenna, 150+ sports modes, 14-day ultra-long battery life.',
      price: 21500,
      comparePrice: 23500,
      stock: 25,
      sku: 'AMZ-GTR4-BR',
      categoryId: categories['smartwatches'].id,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
      ],
    },

    // Power Banks
    {
      name: 'Anker 737 Power Bank (PowerCore 24K, 140W)',
      slug: 'anker-737-power-bank-24k-140w',
      description: 'Ultra-powerful 140W two-way fast charging, smart digital display showing output power and remaining time, 24000mAh capacity.',
      price: 13500,
      comparePrice: 15000,
      stock: 20,
      sku: 'ANK-737-140W',
      categoryId: categories['power-banks'].id,
      isFeatured: true,
      images: [
        'https://images.pexels.com/photos/30845149/pexels-photo-30845149.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
    },
    {
      name: 'Baseus Blade 100W Ultra-Thin Fast Charge Power Bank 20000mAh',
      slug: 'baseus-blade-100w-power-bank-20000mah',
      description: '18mm ultra-thin laptop charger power bank, 100W dual Type-C PD input/output, digital status display, 4-port fast charging.',
      price: 7800,
      comparePrice: 8500,
      stock: 35,
      sku: 'BAS-BLD-100W',
      categoryId: categories['power-banks'].id,
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Xiaomi 20000mAh 50W Fast Charge Power Bank',
      slug: 'xiaomi-20000mah-50w-power-bank',
      description: '50W MAX super flash charge, supports Type-C laptop charging, triple-port output, high quality lithium-ion polymer battery.',
      price: 4400,
      comparePrice: 4900,
      stock: 40,
      sku: 'MI-PB-20K-50W',
      categoryId: categories['power-banks'].id,
      isFeatured: true,
      images: [
        'https://images.pexels.com/photos/19495448/pexels-photo-19495448.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
    },
  ];

  for (const prod of productsData) {
    const { images, ...productData } = prod;
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });

    if (!existing) {
      const created = await prisma.product.create({
        data: {
          ...productData,
          images: {
            create: images.map((url, idx) => ({
              url,
              isPrimary: idx === 0,
            })),
          },
        },
      });
      console.log(`  + Seeded product: ${created.name}`);
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: productData,
      });
    }
  }

  // 4. Seed storefront promotions (admin-managed hero ads and flash sale)
  await seedPromotions(prisma);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
