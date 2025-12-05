import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';



const Order = sequelize.define('Order', {
total: DataTypes.DECIMAL(10,2),
status: { type: DataTypes.ENUM('pending','completed','cancelled'), defaultValue: 'pending' },
shipping_address: DataTypes.TEXT
}, { timestamps: true });


const OrderItem = sequelize.define('OrderItem', {
quantity: DataTypes.INTEGER,
price: DataTypes.DECIMAL(10,2)
}, { timestamps: false });


export { Order, OrderItem };