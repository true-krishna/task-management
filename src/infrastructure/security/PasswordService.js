/**
 * Password Service Implementation
 * Handles password hashing and verification
 */
const bcrypt = require('bcryptjs');
const config = require('../../main/config/env');

class PasswordService {
  constructor(logger) {
    this.logger = logger;
    this.saltRounds = config.security.bcryptSaltRounds;
  }

  /**
   * Hash a password
   */
  async hashPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      this.logger.debug('Password hashed successfully');
      return hashedPassword;
    } catch (error) {
      this.logger.error('Error hashing password', { error: error.message });
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      this.logger.debug('Password comparison completed', { isMatch });
      return isMatch;
    } catch (error) {
      this.logger.error('Error comparing password', { error: error.message });
      throw new Error('Failed to compare password');
    }
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }

    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }

    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = PasswordService;
