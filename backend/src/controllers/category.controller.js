const prisma = require('../config/db');
const { generateSlug } = require('../utils/helpers');

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: { categories } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug, isActive: true },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: { select: { url: true, isPrimary: true }, take: 1, orderBy: { isPrimary: 'desc' } },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: { category } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const slug = generateSlug(name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }

    const category = await prisma.category.create({
      data: { name, slug, description, image },
    });

    res.status(201).json({ success: true, message: 'Category created', data: { category } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    const data = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = generateSlug(name);
    }
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (isActive !== undefined) data.isActive = isActive;

    const category = await prisma.category.update({ where: { id }, data });
    res.json({ success: true, message: 'Category updated', data: { category } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.update({ where: { id }, data: { isActive: false } });
    res.json({ success: true, message: 'Category deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
