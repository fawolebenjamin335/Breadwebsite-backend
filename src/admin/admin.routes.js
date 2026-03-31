import { Router } from "express";
import * as admincontroller from "./admin.controllers.js"

export const adminRouter = Router();

adminRouter.post("/signup", admincontroller.SignuAdminController);
adminRouter.post("/verifysignup", admincontroller.VerifyAdmincontroller);
adminRouter.post("/login", admincontroller.loginAdmin);
