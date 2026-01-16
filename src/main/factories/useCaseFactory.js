/**
 * Use Case Factory
 * Creates and manages use case instances
 */
// Auth use cases
const RegisterUser = require('../../application/use-cases/auth/RegisterUser');
const LoginUser = require('../../application/use-cases/auth/LoginUser');
const RefreshToken = require('../../application/use-cases/auth/RefreshToken');
const LogoutUser = require('../../application/use-cases/auth/LogoutUser');
const VerifyToken = require('../../application/use-cases/auth/VerifyToken');

// User use cases
const GetUserProfile = require('../../application/use-cases/user/GetUserProfile');
const UpdateUserProfile = require('../../application/use-cases/user/UpdateUserProfile');
const GetAllUsers = require('../../application/use-cases/user/GetAllUsers');
const UpdateUserRole = require('../../application/use-cases/user/UpdateUserRole');
const DeactivateUser = require('../../application/use-cases/user/DeactivateUser');

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

  /**
   * Get or create GetUserProfile use case
   */
  getUserProfile() {
    if (!this.useCases.getUserProfile) {
      this.useCases.getUserProfile = new GetUserProfile({
        userRepository: this.repositoryFactory.getUserRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.getUserProfile;
  }

  /**
   * Get or create UpdateUserProfile use case
   */
  getUpdateUserProfile() {
    if (!this.useCases.updateUserProfile) {
      this.useCases.updateUserProfile = new UpdateUserProfile({
        userRepository: this.repositoryFactory.getUserRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.updateUserProfile;
  }

  /**
   * Get or create GetAllUsers use case
   */
  getGetAllUsers() {
    if (!this.useCases.getAllUsers) {
      this.useCases.getAllUsers = new GetAllUsers({
        userRepository: this.repositoryFactory.getUserRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.getAllUsers;
  }

  /**
   * Get or create UpdateUserRole use case
   */
  getUpdateUserRole() {
    if (!this.useCases.updateUserRole) {
      this.useCases.updateUserRole = new UpdateUserRole({
        userRepository: this.repositoryFactory.getUserRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.updateUserRole;
  }

  /**
   * Get or create DeactivateUser use case
   */
  getDeactivateUser() {
    if (!this.useCases.deactivateUser) {
      this.useCases.deactivateUser = new DeactivateUser({
        userRepository: this.repositoryFactory.getUserRepository(),
        refreshTokenRepository: this.repositoryFactory.getRefreshTokenRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.deactivateUser;
  }
}

module.exports = UseCaseFactory;
