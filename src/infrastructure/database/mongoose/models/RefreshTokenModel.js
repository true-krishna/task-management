/**
 * RefreshToken Mongoose Model
 */
const mongoose = require('mongoose');
const RefreshTokenSchema = require('../schemas/RefreshTokenSchema');

const RefreshTokenModel = mongoose.model('RefreshToken', RefreshTokenSchema);

module.exports = RefreshTokenModel;
