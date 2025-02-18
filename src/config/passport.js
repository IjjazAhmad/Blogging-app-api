const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User, SuperAdmin } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    let user = null
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    user = await User.findById(payload.sub);
    if (!user) {
      user = await SuperAdmin.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
