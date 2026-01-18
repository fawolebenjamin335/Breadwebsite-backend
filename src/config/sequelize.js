import { Sequelize } from "sequelize";
import { config } from "./env.js";

export const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: 'postgres',
  logging: false
});


// If deploying to production with a managed database service that requires SSL

// const isProduction = config.nodeENV === 'production';
// const isLocalDevelopment = process.env.NODE_ENV === "development" || !process.env.NODE_ENV

//  export const sequelize = new Sequelize(config.databaseURL,  {

//   logging: false ,
//   dialect: "postgres",
//   dialectOptions: {
//     ssl: isProduction ? {
//       require: true,
//       rejectUnauthorized: false,
//     } : false // Disable SSL for local debvelopment
//   }
// });