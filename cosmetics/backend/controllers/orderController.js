import { Order, OrderItem } from '../models/order.js';
import Product from '../models/product.js';
import User from '../models/user.js';
import { sendEmail } from '../utils/mailer.js';

export async function createOrder(req, res) {
    const userId = req.userId;
    const { items, shipping_address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'No items provided' });
    }

    const t = await Order.sequelize.transaction();
    try {
        let total = 0;
        const order = await Order.create({ userId, total: 0, shipping_address }, { transaction: t });

        for (const it of items) {
            const prod = await Product.findByPk(it.productId, { transaction: t });
            if (!prod) throw new Error('Product not found: ' + it.productId);
            if (prod.stock < it.quantity) throw new Error(`Insufficient stock for ${prod.name}`);
            await prod.update({ stock: prod.stock - it.quantity }, { transaction: t });
            const lineTotal = parseFloat(prod.price) * it.quantity;
            total += lineTotal;
            await OrderItem.create({ orderId: order.id, productId: prod.id, quantity: it.quantity, price: prod.price }, { transaction: t });
        }

        await order.update({ total }, { transaction: t });
        await t.commit();

        const user = await User.findByPk(userId);

        const orderItems = await OrderItem.findAll({ where: { orderId: order.id }, include: Product });
        const itemsHtml = orderItems.map(oi => `<li>${oi.Product.name} x ${oi.quantity} - ₹${oi.price}</li>`).join('');
        const html = `<p>Thanks for your order. Order #${order.id}</p><ul>${itemsHtml}</ul><p>Total: ₹${total}</p>`;

        try { await sendEmail({ to: user.email, subject: `Order #${order.id} confirmation`, html }); } catch (e) { console.error('Customer mail error', e); }
        try { await sendEmail({ to: process.env.ADMIN_EMAIL, subject: `New Order #${order.id}`, html: `<p>From: ${user.email}</p>${html}` }); } catch (e) { console.error('Admin mail error', e); }

        return res.json({ orderId: order.id, total });
    } catch (err) {
        await t.rollback();
        console.error(err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
}

export async function listOrdersForAdmin(req, res) {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: OrderItem, include: [Product] }
            ],
            order: [['createdAt', 'DESC']]
        });
        return res.json(orders);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function listOrdersForUser(req, res) {
    try {
        const userId = req.userId;
        const orders = await Order.findAll({
            where: { userId },
            include: [{ model: OrderItem, include: [Product] }],
            order: [['createdAt', 'DESC']]
        });
        return res.json(orders);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}
