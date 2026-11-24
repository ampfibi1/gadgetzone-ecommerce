const prisma = require('../config/db');
const { calculateFlashPrice } = require('../utils/helpers');

const MIN_DISCOUNT = 1;
const MAX_DISCOUNT = 90;

const normalizeDiscount = (value) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) return null;
  return Math.min(MAX_DISCOUNT, Math.max(MIN_DISCOUNT, parsed));
};

const toPublicFlashSale = (sale) => {
  const { products: items, ...saleData } = sale;
  const products = items
    .map((item) => item.product)
    .filter((product) => product && product.isActive && product.stock > 0)
    .map((product) => ({
      ...product,
      regularPrice: product.price,
      flashPrice: calculateFlashPrice(product.price, sale.discountPercent),
      flashDiscountPercent: sale.discountPercent,
    }));

  return { ...saleData, products };
};

// Public storefront: the live flash sale that is currently running.
const getActiveFlashSale = async (req, res) => {
  try {
    const now = new Date();

    const sale = await prisma.flashSale.findFirst({
      where: {
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      include: {
        products: {
          orderBy: { createdAt: 'asc' },
          include: {
            product: {
              include: {
                category: { select: { id: true, name: true, slug: true } },
                images: { select: { id: true, url: true, isPrimary: true }, orderBy: { isPrimary: 'desc' } },
              },
            },
          },
        },
      },
      orderBy: { endsAt: 'asc' },
    });

    res.json({
      success: true,
      data: { flashSale: sale ? toPublicFlashSale(sale) : null },
    });
  } catch (error) {
    console.error('Get active flash sale error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch flash sale' });
  }
};

// Admin portal: every campaign with its selected products.
const getAllFlashSales = async (req, res) => {
  try {
    const flashSales = await prisma.flashSale.findMany({
      include: {
        products: {
          orderBy: { createdAt: 'asc' },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stock: true,
                isActive: true,
                images: {
                  select: { id: true, url: true, isPrimary: true },
                  take: 1,
                  orderBy: { isPrimary: 'desc' },
                },
              },
            },
          },
        },
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: { flashSales } });
  } catch (error) {
    console.error('Get all flash sales error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch flash sales' });
  }
};

const parseSaleDates = (body, existing = null) => {
  const startsAt = body.startsAt !== undefined ? new Date(body.startsAt) : (existing?.startsAt ?? new Date());
  const endsAt = body.endsAt !== undefined ? new Date(body.endsAt) : existing?.endsAt;

  if (Number.isNaN(startsAt.getTime()) || !endsAt || Number.isNaN(endsAt.getTime())) {
    return { error: 'A valid start and end date are required' };
  }

  if (endsAt <= startsAt) {
    return { error: 'The end date must be after the start date' };
  }

  return { startsAt, endsAt };
};

const resolveProductIds = async (productIds) => {
  if (!Array.isArray(productIds)) return null;

  const uniqueIds = [...new Set(productIds.filter((id) => typeof id === 'string' && id))];
  if (uniqueIds.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true },
  });

  return products.map((product) => product.id);
};

const createFlashSale = async (req, res) => {
  try {
    const { title, subtitle, discountPercent, isActive, productIds } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Flash sale title is required' });
    }

    const discount = normalizeDiscount(discountPercent);
    if (discount === null) {
      return res.status(400).json({ success: false, message: 'A valid discount percentage is required' });
    }

    const dates = parseSaleDates(req.body);
    if (dates.error) {
      return res.status(400).json({ success: false, message: dates.error });
    }

    const selectedProductIds = await resolveProductIds(productIds);

    const sale = await prisma.flashSale.create({
      data: {
        title: String(title).trim(),
        subtitle: subtitle ? String(subtitle).trim() : null,
        discountPercent: discount,
        startsAt: dates.startsAt,
        endsAt: dates.endsAt,
        isActive: isActive === undefined ? true : Boolean(isActive),
        products: selectedProductIds && selectedProductIds.length > 0
          ? { create: selectedProductIds.map((productId) => ({ productId })) }
          : undefined,
      },
      include: { _count: { select: { products: true } } },
    });

    res.status(201).json({ success: true, message: 'Flash sale created', data: { flashSale: sale } });
  } catch (error) {
    console.error('Create flash sale error:', error);
    res.status(500).json({ success: false, message: 'Failed to create flash sale' });
  }
};

const updateFlashSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, discountPercent, isActive, productIds } = req.body;

    const existing = await prisma.flashSale.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Flash sale not found' });
    }

    const data = {};

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({ success: false, message: 'Flash sale title cannot be empty' });
      }
      data.title = String(title).trim();
    }
    if (subtitle !== undefined) data.subtitle = subtitle ? String(subtitle).trim() : null;
    if (discountPercent !== undefined) {
      const discount = normalizeDiscount(discountPercent);
      if (discount === null) {
        return res.status(400).json({ success: false, message: 'A valid discount percentage is required' });
      }
      data.discountPercent = discount;
    }
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    if (req.body.startsAt !== undefined || req.body.endsAt !== undefined) {
      const dates = parseSaleDates(req.body, existing);
      if (dates.error) {
        return res.status(400).json({ success: false, message: dates.error });
      }
      data.startsAt = dates.startsAt;
      data.endsAt = dates.endsAt;
    }

    const selectedProductIds = await resolveProductIds(productIds);

    const flashSale = await prisma.$transaction(async (tx) => {
      const updated = await tx.flashSale.update({ where: { id }, data });

      if (selectedProductIds !== null) {
        await tx.flashSaleProduct.deleteMany({ where: { flashSaleId: id } });
        if (selectedProductIds.length > 0) {
          await tx.flashSaleProduct.createMany({
            data: selectedProductIds.map((productId) => ({ flashSaleId: id, productId })),
          });
        }
      }

      return updated;
    });

    res.json({ success: true, message: 'Flash sale updated', data: { flashSale } });
  } catch (error) {
    console.error('Update flash sale error:', error);
    res.status(500).json({ success: false, message: 'Failed to update flash sale' });
  }
};

const deleteFlashSale = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.flashSale.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Flash sale not found' });
    }

    await prisma.flashSale.delete({ where: { id } });

    res.json({ success: true, message: 'Flash sale deleted' });
  } catch (error) {
    console.error('Delete flash sale error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete flash sale' });
  }
};

module.exports = {
  getActiveFlashSale,
  getAllFlashSales,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
};
