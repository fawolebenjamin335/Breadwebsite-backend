import express from "express"
import { config } from "./config/env.js";
import { initDB } from "./models/index.js";
import { routes } from "./utils/routes.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(routes);


app.use(cookieParser());





app.listen( config.port, async () => {
        try {
          await initDB()
       console.log(`Server running on http://localhost:${config.port}/`)
        } catch (error) {
             console.log(`Error unable to connect to server ${error}`)
       
        }
    }
)