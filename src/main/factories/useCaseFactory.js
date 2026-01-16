/**
 * Use Case Factory
 * Creates and manages use case instances
 */
const RegisterUser = require('../../application/use-cases/auth/RegisterUser');
const LoginUser = require('../../application/use-cases/auth/LoginUser');
const RefreshToken = require('../../application/use-cases/auth/RefreshToken');
const LogoutUser = require('../../application/use-cases/auth/LogoutUser');
const VerifyToken = require('../../application/use-cases/auth/VerifyToken');

class UseCaseFactory {
  constructor({ repositoryFactory, serviceFactory, logger }) {
    this.repositoryFactory = repositoryFactory;
    this.serviceFactory = serviceFactory;
    this.logger = logger;
    this.useCases = {};
  }

  /**
   * Get or create RegisterUser use case
   */
  getRegisterUser() {
    if (!this.useCases.registerUser) {
      this.useCases.registerUser = new RegisterUser({
        userRepository: this.repositoryFactory.getUserRepository(),
        passwordService: this.serviceFactory.getPasswordService(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.registerUser;
  }

  /**
   * Get or create LoginUser use case
   */
  getLoginUser() {
    if (!this.useCases.loginUser) {
      this.useCases.loginUser = new LoginUser({
        userRepository: this.repositoryFactory.getUserRepository(),
        refreshTokenRepository: this.repositoryFactory.getRefreshTokenRepository(),
        passwordService: this.serviceFactory.getPasswordService(),
        tokenService: this.serviceFactory.getTokenService(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.loginUser;
  }

  /**
   * Get or create RefreshToken use case
   */
  getRefreshToken() {
    if (!this.useCases.refreshToken) {
      this.useCases.refreshToken = new RefreshToken({
        userRepository: this.repositoryFactory.getUserRepository(),
        refreshTokenRepository: this.repositoryFactory.getRefreshTokenRepository(),
        tokenService: this.serviceFactory.getTokenService(),
        logger: this.logger,
      });
    }
    return this.useCases.refreshToken;
  }

  /**
   * Get or create LogoutUser use case
   */
  getLogoutUser() {
    if (!this.useCases.logoutUser) {
      this.useCases.logoutUser = new LogoutUser({
        refreshTokenRepository: this.repositoryFactory.getRefreshTokenRepository(),
        tokenService: this.serviceFactory.getTokenService(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.logoutUser;
  }

  /**
   * Get or create VerifyToken use case
   */
  getVerifyToken() {
    if (!this.useCases.verifyToken) {
      this.useCases.verifyToken = new VerifyToken({
        userRepository: this.repositoryFactory.getUserRepository(),
        tokenService: this.serviceFactory.getTokenService(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.verifyToken;
  }
}

module.exports = UseCaseFactory;
