import User from './user.js';
import Product from './product.js';
import Category from './category.js';
import { Order, OrderItem } from './order.js';


// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });


User.hasMany(Order);
Order.belongsTo(User);


Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);


Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);


export { User, Product, Category, Order, OrderItem };