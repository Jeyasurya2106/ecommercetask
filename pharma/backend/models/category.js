import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Category = sequelize.define('Category' , {
    name : { type : DataTypes.STRING , allowNull : false , unique : true},
    slug : { type : DataTypes.STRING , allowNull : false , unique : true},
    description : DataTypes.TEXT
} , {
    timestamps: true
})


export default Category ;