/**
 * VerifyToken Use Case
 * Validates JWT access token
 */
const AuthenticationError = require('../../../domain/errors/AuthenticationError');
const ValidationError = require('../../../domain/errors/ValidationError');

class VerifyToken {
  constructor({ userRepository, tokenService, cacheService, logger }) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  /**
   * Execute the use case
   */
  async execute({ token }) {
    try {
      this.logger.debug('VerifyToken use case started');

      // Validate input
      if (!token || typeof token !== 'string') {
        throw new ValidationError('Token is required');
      }

      // Verify token
      let decoded;
      try {
        decoded = this.tokenService.verifyAccessToken(token);
      } catch (error) {
        throw new AuthenticationError(error.message);
      }

      // Try to get user from cache
      const cacheKey = `user:profile:${decoded.userId}`;
      const cachedUser = await this.cacheService.get(cacheKey);

      if (cachedUser) {
        this.logger.debug('User found in cache', { userId: decoded.userId });
        return JSON.parse(cachedUser);
      }

      // Get user from database
      const user = await this.userRepository.findById(decoded.userId);

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated');
      }

      // Cache user profile
      const cacheTtl = require('../../../main/config/env').cacheTtl.userProfile;
      await this.cacheService.set(cacheKey, JSON.stringify({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
      }), cacheTtl);

      this.logger.debug('Token verified successfully', { userId: user.id });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
      };
    } catch (error) {
      this.logger.error('VerifyToken use case failed', { error: error.message });
      throw error;
    }
  }
}

module.exports = VerifyToken;
