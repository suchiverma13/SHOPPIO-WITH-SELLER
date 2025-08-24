import express from "express";
import { addToCart, getUserCart, updateCart } from "../controllers/cartController.js";
import { requireAuth } from "@clerk/express"; // Clerk middleware

const router = express.Router();

router.post("/add", requireAuth(), addToCart);
router.get("/get", requireAuth(), getUserCart);
router.put("/update", requireAuth(), updateCart);

export default router;
