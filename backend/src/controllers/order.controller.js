const prisma = require('../config/db');
const { generateOrderNumber, paginate, calculateFlashPrice } = require('../utils/helpers');

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, shippingCity, shippingZip, paymentMethod, guestEmail, guestName, guestPhone, notes } = req.body;

    // Validate products and calculate totals
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== items.length) {
      return res.status(400).json({ success: false, message: 'One or more products not found or unavailable' });
    }

    // Honour the live flash sale price for any product included in the campaign
    const now = new Date();
    const activeFlashSale = await prisma.flashSale.findFirst({
      where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
      select: {
        discountPercent: true,
        products: { select: { productId: true } },
      },
      orderBy: { endsAt: 'asc' },
    });
    const flashProductIds = new Set(
      (activeFlashSale?.products || []).map((item) => item.productId)
    );

    // Check stock and build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      const unitPrice = activeFlashSale && flashProductIds.has(product.id)
        ? calculateFlashPrice(product.price, activeFlashSale.discountPercent)
        : product.price;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    const shippingCost = subtotal >= 5000 ? 0 : 120; // Free shipping over ৳5000
    const total = subtotal + shippingCost;
    const orderNumber = generateOrderNumber();

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: req.user ? req.user.id : null,
          guestEmail: req.user ? null : guestEmail,
          guestName: req.user ? null : guestName,
          guestPhone: req.user ? null : guestPhone,
          shippingAddress,
          shippingCity,
          shippingZip: shippingZip || null,
          subtotal,
          shippingCost,
          total,
          status: 'PENDING',
          notes: notes || null,
          items: { create: orderItems },
          payment: {
            create: {
              method: paymentMethod,
              status: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
              amount: total,
            },
          },
        },
        include: {
          items: true,
          payment: true,
        },
      });

      return newOrder;
    });

    // For COD orders, confirm immediately
    if (paymentMethod === 'COD') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' },
      });
      order.status = 'CONFIRMED';
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

const getOrders = async (req, res) => {
  try {
    const { page, limit, status, search } = req.query;
    const { skip, take, page: currentPage, limit: currentLimit } = paginate(page, limit);

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { guestEmail: { contains: search, mode: 'insensitive' } },
        { guestName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: { select: { name: true, quantity: true, price: true, total: true } },
          payment: { select: { method: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: currentPage, limit: currentLimit, total, pages: Math.ceil(total / currentLimit) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { skip, take, page: currentPage, limit: currentLimit } = paginate(page, limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        include: {
          items: { select: { name: true, quantity: true, price: true, total: true } },
          payment: { select: { method: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: currentPage, limit: currentLimit, total, pages: Math.ceil(total / currentLimit) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: true,
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership: customers can only see their own orders
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { payment: true },
    });

    // If cancelled, restore stock
    if (status === 'CANCELLED') {
      const items = await prisma.orderItem.findMany({ where: { orderId: id } });
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    // If delivered with COD, mark payment as completed
    if (status === 'DELIVERED' && order.payment && order.payment.method === 'COD') {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { status: 'COMPLETED', paidAt: new Date() },
      });
    }

    res.json({ success: true, message: 'Order status updated', data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        orderNumber: true,
        status: true,
        total: true,
        shippingCity: true,
        createdAt: true,
        updatedAt: true,
        items: { select: { name: true, quantity: true, price: true, total: true } },
        payment: { select: { method: true, status: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track order' });
  }
};

module.exports = {
  createOrder, getOrders, getMyOrders, getOrder,
  updateOrderStatus, trackOrder,
};
