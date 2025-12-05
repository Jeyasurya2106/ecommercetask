import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import sequelize from './config/db.js';
import './models/index.js';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import User from './models/user.js';
import Category from './models/category.js';

const app = express();


app.use(
  cors({
    origin: [
      'http://localhost:5174', // Vite admin
      // 'http://localhost:3000', // Next.js site 
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);



app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => res.json({ ok: true, time: new Date() }));

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        // seed admin
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@local';
        const existing = await User.findOne({ where: { email: adminEmail } });
        if (!existing) {
            const bcrypt = await import('bcrypt');
            const hashed = await bcrypt.hash('admin123', 10);
            await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
            console.log('Seeded admin user ->', adminEmail, 'password: admin123');
        }

        // seed categories if none
        const catCount = await Category.count();
        if (!catCount) {
            await Category.bulkCreate([
                { name: 'Skin Care', slug: 'skin-care', description: 'Cleansers, moisturizers, serums' },
                { name: 'Makeup', slug: 'makeup', description: 'Foundations, lipsticks, eyeliners' },
                { name: 'Hair Care', slug: 'hair-care', description: 'Shampoos, conditioners' }
            ]);
            console.log('Seeded default categories');
        }

        const port = process.env.PORT || 4000;
        app.listen(port, () => console.log(`Server started on ${port}`));
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
};

start();
