import Product from '../models/product.js';
import Category from '../models/category.js';
import { Op } from 'sequelize';

export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, categoryId, sku, image } = req.body;
        if (!name || price == null) return res.status(400).json({ message: 'Name and price required' });
        if (categoryId) {
            const cat = await Category.findByPk(categoryId);
            if (!cat) return res.status(400).json({ message: 'Invalid categoryId' });
        }
        const p = await Product.create({ name, description, price, stock: stock || 0, sku, image, categoryId: categoryId || null });
        return res.json(p);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

// export async function listProducts(req, res) {
//     try {
//         const { categoryId, categorySlug, q } = req.query;
//         const where = {};
//         if (categoryId) where.categoryId = categoryId;
//         if (q) where.name = { [Op.like]: `%${q}%` };

//         if (categorySlug) {
//             const cat = await Category.findOne({ where: { slug: categorySlug } });
//             if (cat) where.categoryId = cat.id;
//             else {
//                 // no products if category slug invalid
//                 return res.json([]);
//             }
//         }

//         const products = await Product.findAll({
//             where,
//             include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
//             order: [['createdAt', 'DESC']]
//         });
//         return res.json(products);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Server error' });
//     }
// }

export async function listProducts(req, res) {
    try {
        const { categoryId, categorySlug, q, ids } = req.query;
        const where = {};

        // Search
        if (q) where.name = { [Op.like]: `%${q}%` };

        // Filter by category ID
        if (categoryId) where.categoryId = categoryId;

        // Filter by slug
        if (categorySlug) {
            const cat = await Category.findOne({ where: { slug: categorySlug } });
            if (cat) where.categoryId = cat.id;
        }

        // Filter by multiple product IDs  
        if (ids) {
            const idArray = ids.split(',').map(id => Number(id));
            where.id = idArray;
        }

        const products = await Product.findAll({
            where,
            include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
            order: [['createdAt', 'DESC']]
        });

        return res.json(products);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}


export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const p = await Product.findByPk(id, { include: [{ model: Category, attributes: ['id', 'name', 'slug'] }] });
        if (!p) return res.status(404).json({ message: 'Product not found' });
        return res.json(p);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}
