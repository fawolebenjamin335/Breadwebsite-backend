

import joi from "joi";

export const AddproductSchema = joi.object({
    Name: joi.string().required(),
    Description: joi.string().required(),
    Price: joi.number().required(),
    ImgUrl: joi.string(),
    Category: joi.string().required(),
    Quantity: joi.number().required(),
    inStock: joi.boolean(),
    isActive: joi.boolean()
});

export const updateProductSchema = joi.object({

    Description: joi.string(),
    Price: joi.number(),
    Quantity: joi.number(),
    inStock: joi.boolean(),
    isActive: joi.boolean(),
    Name: joi.string(),
    ImgUrl: joi.string(),
})