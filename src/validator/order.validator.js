import joi from "joi";


export const updateOrderStatusSchema = joi.object({
    status: joi.string().valid("pending", "on_the_way", "delivered")
});