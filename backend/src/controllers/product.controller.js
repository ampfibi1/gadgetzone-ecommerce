const prisma = require('../config/db');
const { generateSlug, paginate } = require('../utils/helpers');

const getProducts = async (req, res) => {
  try {
    const { page, limit, search, category, sort, minPrice, maxPrice } = req.query;
    const { skip, take, page: currentPage, limit: currentLimit } = paginate(page, limit);

    const where = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'name') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { select: { id: true, url: true, isPrimary: true }, orderBy: { isPrimary: 'desc' } },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: currentPage,
          limit: currentLimit,
          total,
          pages: Math.ceil(total / currentLimit),
        },
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, url: true, isPrimary: true }, orderBy: { isPrimary: 'desc' } },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: { products } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured products' });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { isPrimary: 'desc' } },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: { product } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, comparePrice, stock, categoryId, sku, isFeatured, images } = req.body;

    const slug = generateSlug(name) + '-' + Date.now().toString(36);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock) || 0,
        categoryId,
        sku: sku || null,
        isFeatured: isFeatured || false,
        images: images && images.length > 0 ? {
          create: images.map((img, idx) => ({
            url: img.url,
            publicId: img.publicId || null,
            isPrimary: idx === 0,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    res.status(201).json({ success: true, message: 'Product created', data: { product } });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, comparePrice, stock, categoryId, sku, isActive, isFeatured, images } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const data = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = generateSlug(name) + '-' + Date.now().toString(36);
    }
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (comparePrice !== undefined) data.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
    if (stock !== undefined) data.stock = parseInt(stock);
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (sku !== undefined) data.sku = sku || null;
    if (isActive !== undefined) data.isActive = isActive;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true, images: true },
    });

    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((img, idx) => ({
            productId: id,
            url: img.url,
            publicId: img.publicId || null,
            isPrimary: idx === 0,
          })),
        });
      }
    }

    const updated = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true },
    });

    res.json({ success: true, message: 'Product updated', data: { product: updated } });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const { skip, take, page: currentPage, limit: currentLimit } = paginate(page, limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          images: { select: { id: true, url: true, isPrimary: true }, take: 1, orderBy: { isPrimary: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: { page: currentPage, limit: currentLimit, total, pages: Math.ceil(total / currentLimit) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

module.exports = {
  getProducts, getFeaturedProducts, getProduct,
  createProduct, updateProduct, deleteProduct, getAllProductsAdmin,
};
