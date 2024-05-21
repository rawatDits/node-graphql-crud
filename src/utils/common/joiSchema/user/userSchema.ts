import Joi from "joi";

export const registerSchema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
});


export const getSchema =Joi.object().keys({
    id: Joi.string().required(),
});


export const loginSchema =Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export const updateSchema = Joi.object().keys({
    id: Joi.string().required(),
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
});