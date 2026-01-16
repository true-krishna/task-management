/**
 * Controller Factory
 * Creates and manages controller instances
 */
const AuthController = require('../../presentation/controllers/AuthController');

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
}

module.exports = ControllerFactory;
