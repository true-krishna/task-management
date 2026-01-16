/**
 * LoginUser Use Case
 * Handles user authentication and token generation
 */
const AuthenticationError = require('../../../domain/errors/AuthenticationError');
const ValidationError = require('../../../domain/errors/ValidationError');

class LoginUser {
  constructor({ 
    userRepository, 
    refreshTokenRepository, 
    passwordService, 
    tokenService, 
    cacheService, 
    logger 
  }) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  /**
   * Execute the use case
   */
  async execute({ email, password, ipAddress = null, userAgent = null }) {
    try {
      this.logger.info('LoginUser use case started', { email });

      // Validate input
      this._validateInput({ email, password });

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await this.passwordService.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        this.logger.warn('Invalid password attempt', { email, ipAddress });
        throw new AuthenticationError('Invalid email or password');
      }

      // Generate tokens
      const accessToken = this.tokenService.generateAccessToken(user);
      const refreshToken = this.tokenService.generateRefreshToken(user);

      // Hash refresh token for storage
      const hashedRefreshToken = this.tokenService.hashToken(refreshToken);

      // Calculate expiration date
      const expiresAt = this.tokenService.getExpirationDate(
        require('../../../main/config/env').jwt.refreshExpiration
      );

      // Store refresh token
      await this.refreshTokenRepository.create({
        userId: user.id,
        token: hashedRefreshToken,
        expiresAt,
        ipAddress,
        userAgent,
      });

      // Update last login time
      await this.userRepository.updateLastLogin(user.id);

      // Cache user profile
      const cacheKey = `user:profile:${user.id}`;
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

      this.logger.info('User logged in successfully', { userId: user.id });

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          role: user.role,
          isActive: user.isActive,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error('LoginUser use case failed', { 
        email, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Validate input data
   */
  _validateInput({ email, password }) {
    const errors = [];

    if (!email || typeof email !== 'string') {
      errors.push('Email is required');
    }

    if (!password || typeof password !== 'string') {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '));
    }
  }
}

module.exports = LoginUser;
