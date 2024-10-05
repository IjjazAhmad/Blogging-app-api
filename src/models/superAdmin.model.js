const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { roles } = require('../config/roles');
const { toJSON } = require('./plugins');
const { ROLE } = require('../utils/constants');

const superAdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
            private: true,
        },
        role: {
            type: String,
            enum: roles,
            default: ROLE.SUPERADMIN,
        },
        isEmailVerified: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

superAdminSchema.plugin(toJSON);

superAdminSchema.pre('save', async function (next) {
    if (this.isModified('password') && !this.password.startsWith('$2a$')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

superAdminSchema.methods.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
};

superAdminSchema.statics.isEmailTaken = async function (email) {
    const superAdmin = await this.findOne({ email });
    return !!superAdmin;
};

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;
