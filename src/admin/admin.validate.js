import joi from "joi"

export const signUpAdminSchema = joi.object(
    {
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        userName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(8).max(25),
        role: joi.string(),
        SSN: joi.string()

    }
)

export const verifyAdminSchema = joi.object({
     email: joi.string().email().required(),
     otp: joi.string().length(4).required()
   
});

export const loginAdminSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(8).max(25) ,
    SSN: joi.string().required()
});