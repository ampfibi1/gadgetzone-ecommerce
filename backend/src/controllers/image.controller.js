const { cloudinary, isConfigured } = require('../config/cloudinary');
const prisma = require('../config/db');
const fs = require('fs');
const path = require('path');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    let imageUrl, publicId;

    if (isConfigured()) {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'gadgetzone', transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }] },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
      publicId = result.public_id;
    } else {
      // Local fallback: save to uploads directory
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, req.file.buffer);
      imageUrl = `/uploads/${filename}`;
      publicId = null;
    }

    // If productId is provided, create a ProductImage record
    if (req.body.productId) {
      const image = await prisma.productImage.create({
        data: {
          url: imageUrl,
          publicId,
          productId: req.body.productId,
          isPrimary: req.body.isPrimary === 'true',
        },
      });
      return res.status(201).json({ success: true, data: { image } });
    }

    res.status(201).json({
      success: true,
      data: { url: imageUrl, publicId },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await prisma.productImage.findUnique({ where: { id } });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Delete from Cloudinary if it has a publicId
    if (image.publicId && isConfigured()) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // Delete from local uploads if local file
    if (!image.publicId && image.url.startsWith('/uploads/')) {
      const filepath = path.join(__dirname, '../..', image.url);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await prisma.productImage.delete({ where: { id } });
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};

module.exports = { uploadImage, deleteImage };
