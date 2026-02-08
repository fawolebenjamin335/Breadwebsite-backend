import joi from "joi";


export const signUpUserSchema = joi.object(
    {
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        userName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(8).max(25)

    }
)

export const verifyUserSchema = joi.object({
     email: joi.string().email().required(),
     otp: joi.string().length(4).required()
   
})

export const loginUserSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(8).max(25)
})