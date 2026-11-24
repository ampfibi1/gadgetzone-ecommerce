import { describe, it, expect } from 'vitest';
const { generateOrderNumber, generateSlug, formatPrice, paginate, calculateFlashPrice } = require('../src/utils/helpers');
const { generateAccessToken, verifyAccessToken } = require('../src/utils/jwt');

describe('Helper Utilities', () => {
  it('should generate order number in correct format', () => {
    const orderNum = generateOrderNumber();
    expect(orderNum).toMatch(/^GZ-\d{8}-[A-F0-9]{6}$/);
  });

  it('should generate url-friendly slug', () => {
    expect(generateSlug('Samsung Galaxy A55 5G!')).toBe('samsung-galaxy-a55-5g');
    expect(generateSlug('Apple AirPods Pro (2nd Gen)')).toBe('apple-airpods-pro-2nd-gen');
  });

  it('should format price in BDT', () => {
    const formatted = formatPrice(49999);
    expect(formatted).toContain('৳');
    expect(formatted).toContain('49,999');
  });

  it('should paginate correctly', () => {
    const p1 = paginate(1, 10);
    expect(p1.skip).toBe(0);
    expect(p1.take).toBe(10);

    const p2 = paginate(3, 15);
    expect(p2.skip).toBe(30);
    expect(p2.take).toBe(15);
  });

  it('should calculate a rounded flash sale price', () => {
    expect(calculateFlashPrice(49999, 20)).toBe(39999);
    expect(calculateFlashPrice(999, 33)).toBe(669);
    expect(calculateFlashPrice(1000, 0)).toBe(1000);
  });
});

describe('JWT Utilities', () => {
  it('should generate and verify access token', () => {
    process.env.JWT_SECRET = 'test-secret-key-123456';
    const user = { id: 'user-123', email: 'test@example.com', role: 'CUSTOMER' };
    const token = generateAccessToken(user);
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe(user.id);
    expect(decoded.email).toBe(user.email);
    expect(decoded.role).toBe(user.role);
  });
});
