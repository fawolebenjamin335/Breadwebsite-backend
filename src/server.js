import express from "express"
import { config } from "./config/env.js";
import { initDB } from "./models/index.js";

const app = express();

app.use(express.json());





app.listen( config.port, async () => {
        try {
          await initDB()
       console.log(`Server running on http://localhost:${config.port}/`)
        } catch (error) {
             console.log(`Error unable to connect to server ${error}`)
       
        }
    }
)