/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */
class AuthController {
  constructor({ 
    registerUser, 
    loginUser, 
    refreshToken, 
    logoutUser, 
    verifyToken, 
    logger 
  }) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
    this.refreshToken = refreshToken;
    this.logoutUser = logoutUser;
    this.verifyToken = verifyToken;
    this.logger = logger;
  }

  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName, avatar } = req.body;

      const result = await this.registerUser.execute({
        email,
        password,
        firstName,
        lastName,
        avatar,
      });

      this.logger.info('User registered via API', { userId: result.id });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent');

      const result = await this.loginUser.execute({
        email,
        password,
        ipAddress,
        userAgent,
      });

      this.logger.info('User logged in via API', { userId: result.user.id });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;

      const result = await this.refreshToken.execute({ refreshToken });

      this.logger.info('Token refreshed via API');

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const userId = req.user ? req.user.userId : null;

      await this.logoutUser.execute({ refreshToken, userId });

      this.logger.info('User logged out via API', { userId });

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current authenticated user
   * GET /api/v1/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = req.user;

      this.logger.debug('Current user retrieved via API', { userId: user.userId });

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
