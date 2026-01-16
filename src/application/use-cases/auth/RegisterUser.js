/**
 * RegisterUser Use Case
 * Handles user registration
 */
const ValidationError = require('../../../domain/errors/ValidationError');
const ConflictError = require('../../../domain/errors/ConflictError');

class RegisterUser {
  constructor({ userRepository, passwordService, cacheService, logger }) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  /**
   * Execute the use case
   */
  async execute({ email, password, firstName, lastName, avatar = null }) {
    try {
      this.logger.info('RegisterUser use case started', { email });

      // Validate input
      this._validateInput({ email, password, firstName, lastName });

      // Validate password strength
      const passwordValidation = this.passwordService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new ValidationError(passwordValidation.errors.join(', '));
      }

      // Check if email already exists
      const emailExists = await this.userRepository.emailExists(email);
      if (emailExists) {
        throw new ConflictError('Email already registered');
      }

      // Hash password
      const hashedPassword = await this.passwordService.hashPassword(password);

      // Create user
      const user = await this.userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        avatar,
        role: 'user',
        isActive: true,
      });

      this.logger.info('User registered successfully', { userId: user.id });

      // Return user without password
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      };
    } catch (error) {
      this.logger.error('RegisterUser use case failed', { 
        email, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Validate input data
   */
  _validateInput({ email, password, firstName, lastName }) {
    const errors = [];

    if (!email || typeof email !== 'string') {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }

    if (!password || typeof password !== 'string') {
      errors.push('Password is required');
    }

    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      errors.push('Last name is required');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '));
    }
  }
}

module.exports = RegisterUser;
