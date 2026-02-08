import { Router } from "express"
import * as usercontrollers from "./user.controllers.js"
import { VerifyPasswordOTP } from "../password/password.controllers.js";
import { ForgottenPassword } from "../password/password.controllers.js";
import { auth } from "../middleware/auth.js";


export const userRouters = Router();


userRouters.post("/refresh", usercontrollers.refresh);
userRouters.post("/logout", usercontrollers.logout);


userRouters.post('/signup', usercontrollers.SignupUserController );
userRouters.post('/verify', usercontrollers.VerifyUserController);
userRouters.post("/login",  usercontrollers.LoginUserController );
userRouters.patch("/profile", auth , usercontrollers.editUserDetailsController );
userRouters.post("/verify-passotp" ,ForgottenPassword);
userRouters.post("/change-password" ,VerifyPasswordOTP);
