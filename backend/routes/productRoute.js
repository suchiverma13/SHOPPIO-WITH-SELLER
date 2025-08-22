import express from 'express';
import { listProduct, addProduct, removingProduct, singleProduct, AdminProductList } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import { adminLogin } from '../controllers/userController.js';
import sellerAuth from '../middleware/sellerAuth.js'

const productRouter = express.Router()

// routes/productRoute.js
productRouter.post('/add', sellerAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);
productRouter.post('/remove', sellerAuth, removingProduct)
productRouter.post('/single', singleProduct)
productRouter.get('/list',listProduct)
productRouter.get('/adminlist',sellerAuth,AdminProductList)

export default productRouter;