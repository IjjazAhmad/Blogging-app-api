const bcrypt = require('bcryptjs');
const { SuperAdmin, User } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { ROLE } = require('../utils/constants');
const tokenService = require('./token.service');
const emailService = require('./email.service');

/**
 * Get super admin by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getSuperAdminByEmail = async (email) => {
    return SuperAdmin.findOne({ email });
};

/**
 * Get user by ID
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
    return User.findById(id);
};

/**
 * Get super admin by ID
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getSuperAdminById = async (id) => {
    return SuperAdmin.findById(id);
};

/**
 * Create a super admin
 * @param {Object} userBody 
 * @returns {Promise<SuperAdmin>}
 */
const createSuperAdmin = async (userBody) => {
    if (await SuperAdmin.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const hashedPassword = await bcrypt.hash(userBody.password, 8);
    const superAdmin = new SuperAdmin({
        name: userBody.name || 'Super Admin',
        email: userBody.email,
        password: hashedPassword,
        role: ROLE.SUPERADMIN,
        isEmailVerified: true,
    });

    return superAdmin.save();
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<SuperAdmin>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await SuperAdmin.findOne({ email });

    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }

    const isPasswordValid = await user.isPasswordMatch(password);
    if (!isPasswordValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }

    return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken) => {
    await tokenService.removeToken(refreshToken);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
    const userData = await tokenService.verifyRefreshToken(refreshToken);

    if (!userData) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const user = await SuperAdmin.findById(userData.id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const tokens = await tokenService.generateAuthTokens(user);
    return tokens;
};

/**
 * Send password reset email
 * @param {string} email
 * @returns {Promise<void>}
 */
const forgotPassword = async (email) => {
    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
    }

    const resetToken = await tokenService.generateResetToken(superAdmin);
    await emailService.sendResetPasswordEmail(superAdmin.email, resetToken);
};

/**
 * Reset password
 * @param {string} token
 * @param {string} password
 * @returns {Promise<void>}
 */
const resetPassword = async (token, password) => {
    const userData = await tokenService.verifyResetToken(token);

    if (!userData) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid reset token');
    }

    const superAdmin = await SuperAdmin.findById(userData.id);
    if (!superAdmin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    superAdmin.password = await bcrypt.hash(password, 8);
    await superAdmin.save();
};

/**
 * Update super admin by ID
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateSuperAdminById = async (userId, updateBody) => {
    const user = await getSuperAdminById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (updateBody.email && (await SuperAdmin.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Restore user by ID
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const restoreUserById = async (userId) => {
    const user = await getUserById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    user.isDeleted = false;
    await user.save();
    return user;
};

/**
 * Force delete user by ID
 * @param {ObjectId} userId
 * @returns {Promise<void>}
 */
const forceDeleteUserById = async (userId) => {
    const user = await getUserById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    await user.remove();
};

/**
 * Promote user by ID
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const promoteUserById = async (userId) => {
    const user = await getUserById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.role === ROLE.USER) {
        user.role = ROLE.MODERATOR;
    } else if (user.role === ROLE.MODERATOR) {
        user.role = ROLE.ADMIN;
    } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot promote further');
    }

    await user.save();
    return user;
};

/**
 * Demote user by ID
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const demoteUserById = async (userId) => {
    const user = await getUserById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.role === ROLE.ADMIN) {
        user.role = ROLE.MODERATOR;
    } else if (user.role === ROLE.MODERATOR) {
        user.role = ROLE.USER;
    } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot demote further');
    }

    await user.save();
    return user;
};

module.exports = {
    createSuperAdmin,
    getUserById,
    restoreUserById,
    forceDeleteUserById,
    promoteUserById,
    demoteUserById,
    loginUserWithEmailAndPassword,
    logout,
    refreshAuth,
    forgotPassword,
    resetPassword,
    getSuperAdminByEmail,
    getSuperAdminById,
    updateSuperAdminById,
};
