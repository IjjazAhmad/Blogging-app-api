const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { ROLE } = require('../utils/constants');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  if (user.role === ROLE.SUPERADMIN) {
    return resolve();
  }
  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    console.log("🚀 ~ verifyCallback ~ userRights:", userRights)
    const hasRequiredRights = requiredRights.every((requiredRight) => {
      return Object.values(userRights).some((rightsArray) => rightsArray.includes(requiredRight));
    });
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden: You dont have permission to access this resource'));
    }
  }
  resolve();
};
const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
