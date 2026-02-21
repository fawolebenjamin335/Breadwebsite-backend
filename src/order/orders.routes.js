import { Router } from "express";
import { adminAuth, auth } from "../middleware/auth.js";
import * as OrderController from "./orders.js"

export const orderRouter = Router();

// Users End Points
orderRouter.post("/createOrder", auth, OrderController.CreateOrderController);
orderRouter.get( "/user/getOrder", auth, OrderController.UsergetOrderController );
orderRouter.get( "/user/getoneOrder/:id", auth, OrderController.UsergetOneOrder );

// Admin End Points
orderRouter.get( "/admin/orders", auth, adminAuth, OrderController.AdminGetAllOrders );
orderRouter.put("/admin/updateOrders", auth, adminAuth, OrderController.updateOrderStatus);
orderRouter.delete("/admin/deleteOrders", auth, adminAuth, OrderController.DeleteOrderController);