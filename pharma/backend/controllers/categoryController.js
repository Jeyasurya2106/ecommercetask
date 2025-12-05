import Category from '../models/category.js';
import Product from '../models/product.js';
import slugify from 'slugify';


export async function createCategory(req, res) {
    try {
        const { name, description } = req.body;

        if (!name) return res.status(400).json({ message: 'Category name required' });

        const slug = slugify(name, { lower: true });

        const [cat] = await Category.findOrCreate({ where: { slug }, defaults: { name, slug, description } });
        return res.json(cat);

    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}


export async function listCategories(req, res) {
    try {
        const categories = await Category.findAll({ order: [['createdAt', 'DESC']] });
        return res.json(categories);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}


export async function listCategoriesWithProducts(req, res) {
    try {
        const categories = await Category.findAll({ include: [{ model: Product }], order: [['createdAt', 'DESC']] });
        return res.json(categories);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}