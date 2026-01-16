/**
 * RefreshToken Repository Implementation
 */
const RefreshToken = require('../../domain/entities/RefreshToken');
const RefreshTokenModel = require('../database/mongoose/models/RefreshTokenModel');

class RefreshTokenRepository {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Create a new refresh token
   */
  async create(tokenData) {
    try {
      const tokenDoc = new RefreshTokenModel(tokenData);
      const savedToken = await tokenDoc.save();
      
      this.logger.info('Refresh token created', { userId: savedToken.userId });
      
      return this._mapToEntity(savedToken);
    } catch (error) {
      this.logger.error('Error creating refresh token', { error: error.message });
      throw error;
    }
  }

  /**
   * Find token by token string
   */
  async findByToken(token) {
    try {
      const tokenDoc = await RefreshTokenModel.findOne({ token });
      return tokenDoc ? this._mapToEntity(tokenDoc) : null;
    } catch (error) {
      this.logger.error('Error finding refresh token', { error: error.message });
      throw error;
    }
  }

  /**
   * Find all tokens for a user
   */
  async findByUserId(userId) {
    try {
      const tokens = await RefreshTokenModel.find({ userId }).sort({ createdAt: -1 });
      return tokens.map((token) => this._mapToEntity(token));
    } catch (error) {
      this.logger.error('Error finding tokens by user ID', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Revoke a token
   */
  async revoke(token) {
    try {
      const result = await RefreshTokenModel.findOneAndUpdate(
        { token },
        { $set: { isRevoked: true } },
        { new: true }
      );
      
      if (!result) {
        return false;
      }
      
      this.logger.info('Refresh token revoked', { userId: result.userId });
      
      return true;
    } catch (error) {
      this.logger.error('Error revoking refresh token', { error: error.message });
      throw error;
    }
  }

  /**
   * Revoke all tokens for a user
   */
  async revokeAllForUser(userId) {
    try {
      const result = await RefreshTokenModel.updateMany(
        { userId, isRevoked: false },
        { $set: { isRevoked: true } }
      );
      
      this.logger.info('All refresh tokens revoked for user', { 
        userId, 
        count: result.modifiedCount 
      });
      
      return result.modifiedCount;
    } catch (error) {
      this.logger.error('Error revoking all tokens', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Delete expired tokens
   */
  async deleteExpired() {
    try {
      const result = await RefreshTokenModel.deleteMany({
        expiresAt: { $lt: new Date() },
      });
      
      this.logger.info('Expired refresh tokens deleted', { count: result.deletedCount });
      
      return result.deletedCount;
    } catch (error) {
      this.logger.error('Error deleting expired tokens', { error: error.message });
      throw error;
    }
  }

  /**
   * Map Mongoose document to RefreshToken entity
   */
  _mapToEntity(tokenDoc) {
    return new RefreshToken({
      id: tokenDoc._id.toString(),
      userId: tokenDoc.userId.toString(),
      token: tokenDoc.token,
      expiresAt: tokenDoc.expiresAt,
      isRevoked: tokenDoc.isRevoked,
      createdAt: tokenDoc.createdAt,
      ipAddress: tokenDoc.ipAddress,
      userAgent: tokenDoc.userAgent,
    });
  }
}

module.exports = RefreshTokenRepository;
