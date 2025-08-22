import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";

const currency = "INR";
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ COD Order
const placedOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
            status: "Pending"
        };

        await orderModel.create(orderData);
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed (COD)" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ Razorpay Order
const placedOrderRazorpay = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        res.json({ success: true, razorpayOrder });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
    try {
        const userId = req.userId;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, address, amount } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature === razorpay_signature) {
            await orderModel.create({
                userId,
                items,
                address,
                amount,
                paymentMethod: "Razorpay",
                payment: true,
                date: Date.now(),
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                status: "Paid"
            });

            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            res.json({ success: true, message: "Payment Verified & Order Placed" });
        } else {
            res.json({ success: false, message: "Payment Verification Failed" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ User Orders
const userOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ Admin / Seller: All orders
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ Update Order Status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// User: Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status.toLowerCase() === "delivered")
      return res.status(400).json({ success: false, message: "Delivered orders cannot be canceled" });

    order.cancelRequested = true;
    await order.save();
    res.json({ success: true, message: "Cancel request sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// User: Return order
const returnOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status.toLowerCase() !== "delivered")
      return res.status(400).json({ success: false, message: "Only delivered orders can be returned" });

    order.returnRequested = true;
    await order.save();
    res.json({ success: true, message: "Return request sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Seller: Approve request
const approveRequest = async (req, res) => {
  try {
    const { orderId, type } = req.body; // type = "cancel" || "return"
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (type === "cancel") {
      order.cancelApproved = true;
      order.status = "Canceled";
    }
    if (type === "return") {
      order.returnApproved = true;
      order.status = "Return Approved";
    }

    await order.save();
    res.json({ success: true, message: `${type} request approved` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export {
    placedOrder,
    placedOrderRazorpay,
    verifyRazorpay,
    userOrders,
    allOrders,
    updateStatus,
    cancelOrder,
    returnOrder,
    approveRequest
};
