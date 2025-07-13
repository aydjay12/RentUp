import { stripe } from "../lib/stripe.js";
import { Coupon } from "../models/coupon.model.js";
import { Order } from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { residencies, couponCode } = req.body;

    if (!Array.isArray(residencies) || residencies.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or empty residencies array" });
    }

    let totalAmount = 0;

    const lineItems = residencies.map((residency) => {
      const amount = Math.round(residency.price * 100);
      totalAmount += amount * (residency.quantity || 1);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: residency.title,
            images: [residency.image],
          },
          unit_amount: amount,
        },
        quantity: residency.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.userId,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.userId.toString(),
        couponCode: couponCode || "",
        residencies: JSON.stringify(
          residencies.map((r) => ({
            id: r._id,
            quantity: r.quantity || 1,
            price: r.price,
          }))
        ),
      },
    });
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if an order with this sessionId already exists
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return res.status(400).json({ message: "Order already processed" });
    }

    if (session.payment_status === "paid") {
      // Mark coupon as used (if any was applied)
      if (session.metadata.couponCode) {
        await Coupon.findOneAndDelete({
          code: session.metadata.couponCode,
          userId: session.metadata.userId,
        });
      }

      // Create a new Order
      const residencies = JSON.parse(session.metadata.residencies);
      const totalAmount = session.amount_total / 100; // Convert from cents to dollars

      const newOrder = new Order({
        user: session.metadata.userId,
        residencies: residencies.map((residency) => ({
          residency: residency.id,
          quantity: residency.quantity,
          price: residency.price,
        })),
        totalAmount,
        stripeSessionId: sessionId,
      });

      await newOrder.save();

      // ✅ Grant coupons based on total amount
      if (totalAmount >= 50000) {
        // Grant BIG50K if not already granted
        await createSpecificCoupon(session.metadata.userId, "BIG50K", 20, 50000);
        // Also grant MID20K if not already granted
        await createSpecificCoupon(session.metadata.userId, "MID20K", 10, 20000);
      } else if (totalAmount >= 20000) {
        await createSpecificCoupon(session.metadata.userId, "MID20K", 10, 20000);
      }

      res.status(200).json({
        success: true,
        message: "Payment successful, order created, and coupon handled.",
        orderId: newOrder._id,
      });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};

// ✅ Function to create a unique coupon per user and amount
async function createSpecificCoupon(userId, couponCode, discountPercentage, minAmount) {
  // Check if the user already has this coupon
  const existingCoupon = await Coupon.findOne({ userId, code: couponCode });

  if (!existingCoupon) {
    const newCoupon = new Coupon({
      code: couponCode,
      discountPercentage,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userId: userId,
    });

    await newCoupon.save();
  }
}

// Create Stripe coupon for discount application
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

// Create a new coupon for eligible users
async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}
