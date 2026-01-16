/**
 * Controller Factory
 * Creates and manages controller instances
 */
const AuthController = require('../../presentation/controllers/AuthController');
const UserController = require('../../presentation/controllers/UserController');

class ControllerFactory {
  constructor({ useCaseFactory, logger }) {
    this.useCaseFactory = useCaseFactory;
    this.logger = logger;
    this.controllers = {};
  }

  /**
   * Get or create AuthController
   */
  getAuthController() {
    if (!this.controllers.authController) {
      this.controllers.authController = new AuthController({
        registerUser: this.useCaseFactory.getRegisterUser(),
        loginUser: this.useCaseFactory.getLoginUser(),
        refreshToken: this.useCaseFactory.getRefreshToken(),
        logoutUser: this.useCaseFactory.getLogoutUser(),
        verifyToken: this.useCaseFactory.getVerifyToken(),
        logger: this.logger,
      });
    }
    return this.controllers.authController;
  }

  /**
   * Get or create UserController
   */
  getUserController() {
    if (!this.controllers.userController) {
      this.controllers.userController = new UserController({
        getUserProfile: this.useCaseFactory.getUserProfile(),
        updateUserProfile: this.useCaseFactory.getUpdateUserProfile(),
        getAllUsers: this.useCaseFactory.getGetAllUsers(),
        updateUserRole: this.useCaseFactory.getUpdateUserRole(),
        deactivateUser: this.useCaseFactory.getDeactivateUser(),
        logger: this.logger,
      });
    }
    return this.controllers.userController;
  }
}

module.exports = ControllerFactory;
