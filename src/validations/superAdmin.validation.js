const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const { ROLE } = require('../utils/constants');

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        role: Joi.string().valid(ROLE.SUPERADMIN),
    }),
};

module.exports = {
    createUser,
};
