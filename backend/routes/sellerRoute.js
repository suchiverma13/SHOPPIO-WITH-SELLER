import express from "express";
import { signupSeller, loginSeller, getAllSellers, deleteSeller,updateSellerStatus } from "../controllers/sellerController.js";

const router = express.Router();

router.post("/signup", signupSeller);
router.post("/login", loginSeller);
router.get("/list", getAllSellers);        // 👈 get all sellers
router.post("/status", updateSellerStatus);
router.delete("/:sellerId", deleteSeller);

export default router;
