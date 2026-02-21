import joi from "joi";

export const AddtoCartSchema = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().required() 
})

export const UpdateCartSchema = joi.object({
    cartItemId : joi.string().required(),
    quantity: joi.number().required(),
})