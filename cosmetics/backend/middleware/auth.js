import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export function verifyToken(req, res, next) {
try {
const auth = req.headers.authorization;
const token = auth?.startsWith('Bearer ') ? auth.split(' ')[1] : null;
if (!token) return res.status(401).json({ message: 'No token provided' });
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userId = decoded.id;
req.userRole = decoded.role;
return next();
} catch (err) {
return res.status(401).json({ message: 'Invalid token' });
}
}


export function adminOnly(req, res, next) {
if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
next();
}