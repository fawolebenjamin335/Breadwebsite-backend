import { Router } from "express";
import * as productControllers from "./product.controllers.js";
import { upload } from "../middleware/multer.js";
import { adminAuth, auth } from "../middleware/auth.js";



export const productRouters = Router();

productRouters.post("/addProduct", auth , adminAuth , upload.single("image"), productControllers.AddProductController);
productRouters.put("/editProduct/:id", auth, adminAuth, upload.single("image"), productControllers.UpdateProductController);
productRouters.delete("/deleteProduct/:id", auth, adminAuth, productControllers.deletProduct);
