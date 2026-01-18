import dotenv from 'dotenv';
import { config } from './env.js';
dotenv.config();

export default {
    development: {
        username: config.db.user,
        password: config.db.password,
        database: config.db.database,
        host: config.host,
        port: config.db.port,
        dialect: "postgres",
    },
    // test: {
    //     username: config.db.user,
    //     password: config.db.pass,
    //     database: config.db.name,
    //     host: config.db.host,
    //     port: config.db.port,
    //     dialect: "postgres",
    // },
    // production: {
    //   use_env_variable: "DATABASE_URL",
    //   dialect: "postgres",
    //   dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false,
    //     }
    //   }
    // }
};
























// {
//   "development": {
//     "username": "root",
//     "password": null,
//     "database": "database_development",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }
