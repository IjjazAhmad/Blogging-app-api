const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const authValidation = require('../../validations/auth.validation');
const superAdminController = require('../../controllers/superAdmin.controller');

const router = express.Router();

router
    .route('/create')
    .post(superAdminController.createSuperAdmin);

router
    .route('/login')
    .post(validate(authValidation.login), superAdminController.login);

router
    .route('/logout')
    .post(validate(authValidation.logout), superAdminController.logout);

router
    .route('/refresh-tokens')
    .post(validate(authValidation.refreshTokens), superAdminController.refreshTokens);

router
    .route('/forgot-password')
    .post(validate(authValidation.forgotPassword), superAdminController.forgotPassword);

router
    .route('/reset-password')
    .post(validate(authValidation.resetPassword), superAdminController.resetPassword);

router
    .route('/promote/:userId')
    .patch(validate(userValidation.updateUser), superAdminController.promoteUser);

router
    .route('/demote/:userId')
    .patch(validate(userValidation.updateUser), superAdminController.demoteUser);

router
    .route('/restore/:userId')
    .patch(validate(userValidation.updateUser), superAdminController.restoreUser);

router
    .route('/delete/:userId')
    .delete(validate(userValidation.deleteUser), superAdminController.forceDeleteUser);

module.exports = router;
