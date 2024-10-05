const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { superAdminService, authService, tokenService, emailService } = require('../services');

const createSuperAdmin = catchAsync(async (req, res) => {
    const superAdmin = await superAdminService.createSuperAdmin(req.body);
    res.status(httpStatus.CREATED).send(superAdmin);
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const superAdmin = await superAdminService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(superAdmin);
    res.send({ superAdmin, tokens });
});

const logout = catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.OK).send({ message: 'User logged out' });
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateSuperAdminResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.OK).send({ message: 'Email sent successfully' });
});

const resetPassword = catchAsync(async (req, res) => {
    await authService.superAdminResetPassword(req.query.token, req.body.password);
    res.status(httpStatus.OK).send({ message: 'Password reset successfully' });
});

const promoteUser = catchAsync(async (req, res) => {
    const user = await superAdminService.promoteUserById(req.params.userId);
    res.send(user);
});

const demoteUser = catchAsync(async (req, res) => {
    const user = await superAdminService.demoteUserById(req.params.userId);
    res.send(user);
});

const restoreUser = catchAsync(async (req, res) => {
    const user = await superAdminService.restoreUserById(req.params.userId);
    res.send(user);
});

const forceDeleteUser = catchAsync(async (req, res) => {
    await superAdminService.forceDeleteUserById(req.params.userId);
    res.status(httpStatus.OK).send({ message: 'User permanently deleted' });
});

module.exports = {
    createSuperAdmin,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    promoteUser,
    demoteUser,
    restoreUser,
    forceDeleteUser,
};
