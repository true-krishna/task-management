/**
 * Token Service Implementation
 * Handles JWT token generation and verification
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../main/config/env');

class TokenService {
  constructor(logger) {
    this.logger = logger;
    this.accessSecret = config.jwt.accessSecret;
    this.refreshSecret = config.jwt.refreshSecret;
    this.accessExpiration = config.jwt.accessExpiration;
    this.refreshExpiration = config.jwt.refreshExpiration;
  }

  /**
   * Generate access token
   */
  generateAccessToken(user) {
    try {
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
      };

      const token = jwt.sign(payload, this.accessSecret, {
        expiresIn: this.accessExpiration,
      });

      this.logger.debug('Access token generated', { userId: user.id });

      return token;
    } catch (error) {
      this.logger.error('Error generating access token', { error: error.message });
      throw new Error('Failed to generate access token');
    }
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(user) {
    try {
      const payload = {
        userId: user.id,
        email: user.email,
        type: 'refresh',
      };

      const token = jwt.sign(payload, this.refreshSecret, {
        expiresIn: this.refreshExpiration,
      });

      this.logger.debug('Refresh token generated', { userId: user.id });

      return token;
    } catch (error) {
      this.logger.error('Error generating refresh token', { error: error.message });
      throw new Error('Failed to generate refresh token');
    }
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessSecret);

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      this.logger.debug('Access token verified', { userId: decoded.userId });

      return decoded;
    } catch (error) {
      this.logger.warn('Access token verification failed', { error: error.message });
      
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      }
      
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      }
      
      throw new Error('Token verification failed');
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshSecret);

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      this.logger.debug('Refresh token verified', { userId: decoded.userId });

      return decoded;
    } catch (error) {
      this.logger.warn('Refresh token verification failed', { error: error.message });
      
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      }
      
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      
      throw new Error('Token verification failed');
    }
  }

  /**
   * Generate random token (for hashing)
   */
  generateRandomToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Hash token
   */
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Decode token without verification (for debugging)
   */
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      this.logger.error('Error decoding token', { error: error.message });
      return null;
    }
  }

  /**
   * Get token expiration date
   */
  getExpirationDate(expirationString) {
    // Parse expiration string (e.g., "7d", "15m", "1h")
    const match = expirationString.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      throw new Error('Invalid expiration format');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const now = new Date();

    switch (unit) {
      case 's': // seconds
        return new Date(now.getTime() + value * 1000);
      case 'm': // minutes
        return new Date(now.getTime() + value * 60 * 1000);
      case 'h': // hours
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'd': // days
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default:
        throw new Error('Invalid time unit');
    }
  }
}

module.exports = TokenService;
