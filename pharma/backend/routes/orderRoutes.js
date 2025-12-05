import express from 'express';
import { createOrder, listOrdersForAdmin, listOrdersForUser } from '../controllers/orderController.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();


router.post('/', verifyToken, createOrder);
router.get('/admin', verifyToken, adminOnly, listOrdersForAdmin);
router.get('/', verifyToken, listOrdersForUser);


export default router;
