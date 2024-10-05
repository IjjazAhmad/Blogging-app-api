const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');
const { ROLE } = require('../utils/constants');

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: ROLE.USER,
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.plugin(toJSON);

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
