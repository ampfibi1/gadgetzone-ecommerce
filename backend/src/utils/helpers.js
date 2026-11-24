const { v4: uuidv4 } = require('uuid');

const generateOrderNumber = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = uuidv4().split('-')[0].toUpperCase().slice(0, 6);
  return `GZ-${y}${m}${d}-${rand}`;
};

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const formatPrice = (amount) => {
  return `৳${Number(amount).toLocaleString('en-BD')}`;
};

const calculateFlashPrice = (price, discountPercent) => {
  const base = Number(price) || 0;
  const discount = Math.min(100, Math.max(0, Number(discountPercent) || 0));
  return Math.round(base * (1 - discount / 100));
};

const paginate = (page = 1, limit = 12) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(50, Math.max(1, parseInt(limit)));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
};

module.exports = { generateOrderNumber, generateSlug, formatPrice, paginate, calculateFlashPrice };
