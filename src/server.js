import express from "express"
import { config } from "./config/env.js";
import { sequelize } from "./config/sequelize.js";

const app = express();

app.use(express.json());





app.listen( config.port, async () => {
        try {
            await sequelize.authenticate();
       console.log('Connection has been established successfully.');
       console.log(`Server running on https://${config.port}`)

        } catch (error) {
             console.log(`Error unable to connect to server`, error)
            console.error(`Database conneection error ${error}`);
        }
    }
)