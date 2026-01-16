/**
 * LogoutUser Use Case
 * Handles user logout and token revocation
 */
const ValidationError = require('../../../domain/errors/ValidationError');

class LogoutUser {
  constructor({ 
    refreshTokenRepository, 
    tokenService, 
    cacheService, 
    logger 
  }) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.tokenService = tokenService;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  /**
   * Execute the use case
   */
  async execute({ refreshToken, userId = null }) {
    try {
      this.logger.info('LogoutUser use case started', { userId });

      // If refresh token provided, revoke it
      if (refreshToken) {
        const hashedToken = this.tokenService.hashToken(refreshToken);
        await this.refreshTokenRepository.revoke(hashedToken);
        this.logger.info('Refresh token revoked', { userId });
      }

      // If userId provided, invalidate user cache
      if (userId) {
        const cacheKey = `user:profile:${userId}`;
        await this.cacheService.del(cacheKey);
        this.logger.debug('User cache invalidated', { userId });
      }

      this.logger.info('User logged out successfully', { userId });

      return { success: true };
    } catch (error) {
      this.logger.error('LogoutUser use case failed', { 
        userId, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Logout from all devices (revoke all refresh tokens)
   */
  async executeAll({ userId }) {
    try {
      this.logger.info('LogoutUser (all devices) use case started', { userId });

      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      // Revoke all refresh tokens
      const count = await this.refreshTokenRepository.revokeAllForUser(userId);

      // Invalidate user cache
      const cacheKey = `user:profile:${userId}`;
      await this.cacheService.del(cacheKey);

      this.logger.info('User logged out from all devices', { userId, tokensRevoked: count });

      return { success: true, tokensRevoked: count };
    } catch (error) {
      this.logger.error('LogoutUser (all devices) use case failed', { 
        userId, 
        error: error.message 
      });
      throw error;
    }
  }
}

module.exports = LogoutUser;
