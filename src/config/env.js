import dotenv from "dotenv";

dotenv.config();

export const config = {
    port:process.env.PORT,

    db: {
        database: process.env.DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT

    }

}