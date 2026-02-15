import dotenv from "dotenv";

dotenv.config();



//export default cloudinary

export const config = {
    port:process.env.PORT,
    users:process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
    accessSecret: process.env.ACCESS_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,

    db: {
        database: process.env.DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT

    }

}