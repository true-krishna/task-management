/**
 * RefreshToken Use Case
 * Handles refresh token rotation
 */
const AuthenticationError = require('../../../domain/errors/AuthenticationError');
const ValidationError = require('../../../domain/errors/ValidationError');

class RefreshTokenUseCase {
  constructor({ 
    userRepository, 
    refreshTokenRepository, 
    tokenService, 
    logger 
  }) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.tokenService = tokenService;
    this.logger = logger;
  }

  /**
   * Execute the use case
   */
  async execute({ refreshToken }) {
    try {
      this.logger.info('RefreshToken use case started');

      // Validate input
      if (!refreshToken || typeof refreshToken !== 'string') {
        throw new ValidationError('Refresh token is required');
      }

      // Verify refresh token JWT
      let decoded;
      try {
        decoded = this.tokenService.verifyRefreshToken(refreshToken);
      } catch (error) {
        throw new AuthenticationError(error.message);
      }

      // Hash token to find in database
      const hashedToken = this.tokenService.hashToken(refreshToken);

      // Find token in database
      const storedToken = await this.refreshTokenRepository.findByToken(hashedToken);
      
      if (!storedToken) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Check if token is valid
      if (!storedToken.isValid()) {
        throw new AuthenticationError('Refresh token is expired or revoked');
      }

      // Get user
      const user = await this.userRepository.findById(decoded.userId);
      
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated');
      }

      // Revoke old refresh token
      await this.refreshTokenRepository.revoke(hashedToken);

      // Generate new tokens
      const newAccessToken = this.tokenService.generateAccessToken(user);
      const newRefreshToken = this.tokenService.generateRefreshToken(user);

      // Hash new refresh token
      const hashedNewRefreshToken = this.tokenService.hashToken(newRefreshToken);

      // Calculate expiration date
      const expiresAt = this.tokenService.getExpirationDate(
        require('../../../main/config/env').jwt.refreshExpiration
      );

      // Store new refresh token
      await this.refreshTokenRepository.create({
        userId: user.id,
        token: hashedNewRefreshToken,
        expiresAt,
        ipAddress: storedToken.ipAddress,
        userAgent: storedToken.userAgent,
      });

      this.logger.info('Tokens refreshed successfully', { userId: user.id });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.logger.error('RefreshToken use case failed', { error: error.message });
      throw error;
    }
  }
}

module.exports = RefreshTokenUseCase;
