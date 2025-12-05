import express from 'express';
import { createProduct, listProducts, getProductById } from '../controllers/productController.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();


router.post('/', verifyToken, adminOnly, createProduct);
router.get('/', listProducts);
router.get('/:id', getProductById);


export default router;
