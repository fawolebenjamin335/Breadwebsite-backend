import { sequelize } from "../config/sequelize.js";

import { User } from "./user.js";
import { Product } from "./product.js";
import { Cart } from "./cart.js";
import { CartItem } from "./cartitem.js";
import { Order } from "./order.js";
import { Orderitem } from "./orderitem.js";


// User Relaationshps
User.hasOne(Cart, { foreignKey: "userId", as: "cart" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// Cart Relationships
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "cartItems" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

// Product Relationships
Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Orderitem, { foreignKey: "productId", as: "orderItems" });
Orderitem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Order Relationships
Order.hasMany(Orderitem, { foreignKey: "orderId", as: "orderItems" });
Orderitem.belongsTo(Order, { foreignKey: "orderId", as: "order" });


export {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  Orderitem
};


export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connection successful`);
    
  } catch (error) {
    console.log(`Datyabase connection failed ${error}`);
    
    
  }
  
}

// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/database.js')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
