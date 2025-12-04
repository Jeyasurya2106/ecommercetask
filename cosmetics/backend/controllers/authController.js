import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';


export async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;

        if (!email || !password) return res.status(400).json({ message: 'Email and Password Required' });

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email Already Exists' });

        const hashed = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashed, role: role })
        return res.json({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}


export async function login(req, res) {
    try {
        const { email, password } = req.body;


        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });


        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });


        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}