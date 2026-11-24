const DEFAULT_BANNERS = [
  {
    title: '11.11 Gadget Festival',
    subtitle: 'Up to 45% off flagship smartphones, ANC earbuds and smartwatches. Official warranty on every order.',
    badge: 'LIMITED TIME',
    ctaText: 'Shop the deals',
    linkUrl: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&h=700&auto=format&fit=crop&q=80',
    theme: 'sky',
    sortOrder: 0,
  },
  {
    title: 'Sound of the Season',
    subtitle: 'Noise-cancelling true wireless earbuds from ৳1,990, backed by 1-year official warranty.',
    badge: 'AUDIO WEEK',
    ctaText: 'Explore earbuds',
    linkUrl: '/products?category=earbuds',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1200&h=700&auto=format&fit=crop&q=80',
    theme: 'violet',
    sortOrder: 1,
  },
  {
    title: 'Power Up. Anywhere.',
    subtitle: 'High-wattage power banks and fast chargers for every device, starting from ৳2,490.',
    badge: 'FAST CHARGING',
    ctaText: 'Shop power banks',
    linkUrl: '/products?category=power-banks',
    imageUrl: 'https://images.pexels.com/photos/30845149/pexels-photo-30845149.jpeg?auto=compress&cs=tinysrgb&w=1200',
    theme: 'amber',
    sortOrder: 2,
  },
  {
    title: 'Wear the Future',
    subtitle: 'AMOLED displays, built-in GPS and up to 14-day battery life from ৳4,900.',
    badge: 'SMARTWATCH DAYS',
    ctaText: 'Browse smartwatches',
    linkUrl: '/products?category=smartwatches',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&h=700&auto=format&fit=crop&q=80',
    theme: 'emerald',
    sortOrder: 3,
  },
];

/**
 * Creates the default storefront promotions when the new tables are still empty.
 * Safe to call repeatedly: it only writes when no banners / flash sales exist.
 */
async function seedPromotions(prisma) {
  const bannerCount = await prisma.banner.count();

  if (bannerCount === 0) {
    await prisma.banner.createMany({ data: DEFAULT_BANNERS });
    console.log(`✅ Seeded ${DEFAULT_BANNERS.length} hero ad banners`);
  }

  const flashSaleCount = await prisma.flashSale.count();

  if (flashSaleCount === 0) {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true, stock: { gt: 0 } },
      select: { id: true },
      take: 6,
      orderBy: { price: 'asc' },
    });

    if (products.length > 0) {
      const endsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await prisma.flashSale.create({
        data: {
          title: 'Midnight Flash Sale',
          subtitle: 'This week only — extra savings on our most-loved gadgets.',
          discountPercent: 20,
          startsAt: new Date(),
          endsAt,
          products: {
            create: products.map((product) => ({ productId: product.id })),
          },
        },
      });

      console.log(`✅ Seeded flash sale with ${products.length} products`);
    }
  }
}

module.exports = { seedPromotions, DEFAULT_BANNERS };
