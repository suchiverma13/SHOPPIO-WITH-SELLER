import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: "Order Placed" },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },

    // 👇 New fields for seller/user actions
    cancelRequested: { type: Boolean, default: false },   // user requested cancel
    returnRequested: { type: Boolean, default: false },   // user requested return
    cancelApproved: { type: Boolean, default: false },    // seller/admin approved cancel
    returnApproved: { type: Boolean, default: false }     // seller/admin approved return
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export default orderModel
