import { Router } from "express";
import { userRouters } from "../user/user.routes.js";

export const routes  = Router();

routes.use("/users", userRouters)