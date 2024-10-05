const Joi = require('joi');

const createPost = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
        imageUrl: Joi.string().uri().optional(),
        author: Joi.string().required(),
    }),
};

const updatePost = {
    params: Joi.object().keys({
        postId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        title: Joi.string().optional(),
        content: Joi.string().optional(),
        imageUrl: Joi.string().uri().optional(),
    }),
};

const deletePost = {
    params: Joi.object().keys({
        postId: Joi.string().required(),
    }),
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
};
