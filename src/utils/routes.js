import { Router } from "express";
import { userRouters } from "../user/user.routes.js";
import { productRouters } from "../products/product.routes.js";
import { cartRouter } from "../cart/cart.routes.js";
import { orderRouter } from "../order/orders.routes.js";

export const routes  = Router();

routes.use("/users", userRouters)
routes.use("/products", productRouters);
routes.use("/carts", cartRouter);
routes.use( "/orders", orderRouter )