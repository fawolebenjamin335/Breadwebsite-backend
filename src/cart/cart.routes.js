import { Router } from "express";
import * as cartControllers from "./cart.controllers.js";
import { auth } from "../middleware/auth.js";


export const cartRouter = Router();

cartRouter.post("/addToCart", auth,cartControllers.addToCart);
cartRouter.get("/getCartItem", auth, cartControllers.Getcart);
cartRouter.put("/updateCartItem", auth, cartControllers.UpdateCartItem);
cartRouter.delete("/deleteCartItem/:productId", auth, cartControllers.removeCartItem);

