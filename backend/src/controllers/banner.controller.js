const prisma = require('../config/db');

const ALLOWED_THEMES = ['sky', 'violet', 'emerald', 'amber', 'rose', 'slate'];

const normalizeTheme = (theme) => (
  ALLOWED_THEMES.includes(theme) ? theme : 'sky'
);

const sanitizeBannerPayload = (body) => {
  const data = {};

  if (body.title !== undefined) data.title = String(body.title).trim();
  if (body.subtitle !== undefined) data.subtitle = body.subtitle ? String(body.subtitle).trim() : null;
  if (body.badge !== undefined) data.badge = body.badge ? String(body.badge).trim() : null;
  if (body.ctaText !== undefined) data.ctaText = body.ctaText ? String(body.ctaText).trim() : null;
  if (body.linkUrl !== undefined) data.linkUrl = body.linkUrl ? String(body.linkUrl).trim() : null;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
  if (body.theme !== undefined) data.theme = normalizeTheme(String(body.theme));
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
  if (body.sortOrder !== undefined) data.sortOrder = Number.isFinite(Number(body.sortOrder)) ? parseInt(body.sortOrder, 10) : 0;

  return data;
};

// Public storefront: only live slides, in the order chosen by the admin.
const getPublicBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    res.json({ success: true, data: { banners } });
  } catch (error) {
    console.error('Get public banners error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
};

// Admin portal: every slide, including inactive drafts.
const getAllBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    res.json({ success: true, data: { banners } });
  } catch (error) {
    console.error('Get all banners error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
};

const createBanner = async (req, res) => {
  try {
    const data = sanitizeBannerPayload(req.body);

    if (!data.title) {
      return res.status(400).json({ success: false, message: 'Banner title is required' });
    }

    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle ?? null,
        badge: data.badge ?? null,
        ctaText: data.ctaText ?? null,
        linkUrl: data.linkUrl ?? null,
        imageUrl: data.imageUrl ?? null,
        theme: data.theme ?? 'sky',
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });

    res.status(201).json({ success: true, message: 'Banner created', data: { banner } });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ success: false, message: 'Failed to create banner' });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const data = sanitizeBannerPayload(req.body);

    if (data.title !== undefined && !data.title) {
      return res.status(400).json({ success: false, message: 'Banner title cannot be empty' });
    }

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const banner = await prisma.banner.update({ where: { id }, data });

    res.json({ success: true, message: 'Banner updated', data: { banner } });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ success: false, message: 'Failed to update banner' });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    await prisma.banner.delete({ where: { id } });

    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete banner' });
  }
};

module.exports = {
  getPublicBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
