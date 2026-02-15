import { Router } from "express";
import { userRouters } from "../user/user.routes.js";
import { productRouters } from "../products/product.routes.js";

export const routes  = Router();

routes.use("/users", userRouters)
routes.use("/products", productRouters);