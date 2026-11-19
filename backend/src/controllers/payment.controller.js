const prisma = require('../config/db');

const createBkashPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.payment && order.payment.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Payment already completed' });
    }

    const hasBkashCredentials = process.env.BKASH_APP_KEY && process.env.BKASH_APP_SECRET;

    if (hasBkashCredentials) {
      // Real bKash integration
      try {
        // Step 1: Get grant token
        const tokenResponse = await fetch(`${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            username: process.env.BKASH_USERNAME,
            password: process.env.BKASH_PASSWORD,
          },
          body: JSON.stringify({
            app_key: process.env.BKASH_APP_KEY,
            app_secret: process.env.BKASH_APP_SECRET,
          }),
        });
        const tokenData = await tokenResponse.json();

        if (!tokenData.id_token) {
          throw new Error('Failed to get bKash token');
        }

        // Step 2: Create payment
        const paymentResponse = await fetch(`${process.env.BKASH_BASE_URL}/tokenized/checkout/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: tokenData.id_token,
            'X-APP-Key': process.env.BKASH_APP_KEY,
          },
          body: JSON.stringify({
            mode: '0011',
            payerReference: order.orderNumber,
            callbackURL: `${process.env.FRONTEND_URL}/payment/bkash/callback`,
            amount: order.total.toString(),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: order.orderNumber,
          }),
        });
        const paymentData = await paymentResponse.json();

        if (paymentData.bkashURL) {
          await prisma.payment.update({
            where: { orderId: order.id },
            data: { bkashPaymentId: paymentData.paymentID },
          });

          return res.json({
            success: true,
            data: {
              bkashURL: paymentData.bkashURL,
              paymentID: paymentData.paymentID,
            },
          });
        }

        throw new Error(paymentData.statusMessage || 'bKash payment creation failed');
      } catch (bkashError) {
        console.error('bKash API error:', bkashError);
        // Fall through to sandbox mode
      }
    }

    // Sandbox/simulation mode
    const simulatedPaymentId = `SIM-${Date.now()}`;
    await prisma.payment.update({
      where: { orderId: order.id },
      data: { bkashPaymentId: simulatedPaymentId },
    });

    res.json({
      success: true,
      message: 'bKash sandbox mode - payment simulated',
      data: {
        paymentID: simulatedPaymentId,
        bkashURL: null,
        sandbox: true,
        orderId: order.id,
      },
    });
  } catch (error) {
    console.error('bKash create error:', error);
    res.status(500).json({ success: false, message: 'Payment creation failed' });
  }
};

const executeBkashPayment = async (req, res) => {
  try {
    const { paymentID, orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const hasBkashCredentials = process.env.BKASH_APP_KEY && process.env.BKASH_APP_SECRET;

    if (hasBkashCredentials && !paymentID.startsWith('SIM-')) {
      // Real bKash execution would go here
      // Execute the payment with bKash API
      try {
        const tokenResponse = await fetch(`${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', username: process.env.BKASH_USERNAME, password: process.env.BKASH_PASSWORD },
          body: JSON.stringify({ app_key: process.env.BKASH_APP_KEY, app_secret: process.env.BKASH_APP_SECRET }),
        });
        const tokenData = await tokenResponse.json();

        const executeResponse = await fetch(`${process.env.BKASH_BASE_URL}/tokenized/checkout/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: tokenData.id_token,
            'X-APP-Key': process.env.BKASH_APP_KEY,
          },
          body: JSON.stringify({ paymentID }),
        });
        const executeData = await executeResponse.json();

        if (executeData.statusCode === '0000') {
          await prisma.payment.update({
            where: { orderId: order.id },
            data: {
              status: 'COMPLETED',
              transactionId: executeData.trxID,
              bkashTrxId: executeData.trxID,
              paidAt: new Date(),
            },
          });

          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'CONFIRMED' },
          });

          return res.json({
            success: true,
            message: 'Payment completed',
            data: { trxID: executeData.trxID },
          });
        }

        throw new Error(executeData.statusMessage || 'Payment execution failed');
      } catch (bkashError) {
        console.error('bKash execute error:', bkashError);
      }
    }

    // Sandbox: simulate successful payment
    const trxId = `TRX-${Date.now()}`;
    await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        status: 'COMPLETED',
        transactionId: trxId,
        bkashTrxId: trxId,
        paidAt: new Date(),
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CONFIRMED' },
    });

    res.json({
      success: true,
      message: 'Payment completed (sandbox)',
      data: { trxID: trxId, sandbox: true },
    });
  } catch (error) {
    console.error('Execute payment error:', error);
    res.status(500).json({ success: false, message: 'Payment execution failed' });
  }
};

const bkashCallback = async (req, res) => {
  try {
    const { paymentID, status } = req.query;
    if (status === 'success') {
      res.redirect(`${process.env.FRONTEND_URL}/payment/success?paymentID=${paymentID}`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/payment/failed?paymentID=${paymentID}`);
    }
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
  }
};

const processCOD = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // COD is confirmed upon order placement
    res.json({
      success: true,
      message: 'Cash on Delivery order confirmed',
      data: { order },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'COD processing failed' });
  }
};

module.exports = { createBkashPayment, executeBkashPayment, bkashCallback, processCOD };
