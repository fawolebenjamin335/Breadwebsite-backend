import joi from 'joi';

export const PasswordVerifySchema = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
     newpassword: joi.string().required(),
     confirmPassword: joi.string().required()
})


export const ForgottenPasswordSchema = joi.object({
    email: joi.string().email().required()
})