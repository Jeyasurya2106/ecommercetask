import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";



const Product = sequelize.define('Product' , {
    name : { type : DataTypes.STRING , allowNull : false},
    description : DataTypes.TEXT,
    price : { type : DataTypes.DECIMAL(10,2) , allowNull : false},
    stock : { type : DataTypes.INTEGER , defaultValue : 0},
    sku : { type : DataTypes.STRING , allowNull : true},
    image : { type : DataTypes.STRING , allowNull : true }
} , { 
    timestamps : true
})

export default Product ;