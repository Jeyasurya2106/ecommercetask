import express from 'express';
import { createCategory, listCategories, listCategoriesWithProducts } from '../controllers/categoryController.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, adminOnly, createCategory);
router.get('/', listCategories);
router.get('/with-products', listCategoriesWithProducts);


export default router;
