/**
 * Service Factory
 * Creates and manages service instances
 */
const PasswordService = require('../../infrastructure/security/PasswordService');
const TokenService = require('../../infrastructure/security/TokenService');
const CacheService = require('../../infrastructure/cache/CacheService');

class ServiceFactory {
  constructor({ logger, redisClient }) {
    this.logger = logger;
    this.redisClient = redisClient;
    this.services = {};
  }

  /**
   * Get or create PasswordService
   */
  getPasswordService() {
    if (!this.services.passwordService) {
      this.services.passwordService = new PasswordService(this.logger);
    }
    return this.services.passwordService;
  }

  /**
   * Get or create TokenService
   */
  getTokenService() {
    if (!this.services.tokenService) {
      this.services.tokenService = new TokenService(this.logger);
    }
    return this.services.tokenService;
  }

  /**
   * Get or create CacheService
   */
  getCacheService() {
    if (!this.services.cacheService) {
      this.services.cacheService = new CacheService(this.redisClient, this.logger);
    }
    return this.services.cacheService;
  }
}

module.exports = ServiceFactory;
