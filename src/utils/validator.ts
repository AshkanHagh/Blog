import * as Joi from 'joi';

const validator = (schema : any) => (payload : any) => schema.validate(payload, {abortEarly : false});

// User validation

const signupSchema = Joi.object({
    fullName : Joi.string().required(),
    username : Joi.string().required(),
    password : Joi.string().min(6).max(255).required(),
    confirmPassword : Joi.ref('password'),
    gender : Joi.string().required()
});

export const validateSignup = validator(signupSchema);

// Posts validation

const postSchema = Joi.object({
    title : Joi.string().required(),
    description : Joi.string().max(255).required()
});

export const validatePost = validator(postSchema);

const updatePostSchema = Joi.object({
    title : Joi.string().required(),
    description : Joi.string().max(255).required(),
    isPublish : Joi.string().required()
});

export const validatePostUpdate = validator(updatePostSchema);