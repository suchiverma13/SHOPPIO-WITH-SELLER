import express from "express"
import { allOrders, placedOrder, returnOrder, cancelOrder, placedOrderRazorpay, approveRequest, updateStatus, userOrders, verifyRazorpay } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import sellerAuth from '../middleware/sellerAuth.js'
const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', sellerAuth, allOrders)
orderRouter.post('/status', sellerAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, placedOrder)
// orderRouter.post('/stripe',authUser,placedOrderStripe)
orderRouter.post('/razorpay', authUser, placedOrderRazorpay);



// User Feature

orderRouter.post("/userorders", authUser, userOrders)


orderRouter.post("/cancel", cancelOrder);
orderRouter.post("/return", returnOrder);
orderRouter.post("/approve", approveRequest);
// verify payment
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)


export default orderRouter;