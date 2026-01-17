const PasswordService = require('../../../../src/infrastructure/security/PasswordService');
const bcrypt = require('bcryptjs');

jest.mock('bcryptjs');

describe('PasswordService', () => {
  let passwordService;
  let mockLogger;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };

    passwordService = new PasswordService(mockLogger);
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'Password123!';
      const hashedPassword = '$2a$10$hashedpassword';

      bcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await passwordService.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number));
    });

    it('should throw error if hashing fails', async () => {
      bcrypt.hash.mockRejectedValue(new Error('Hashing failed'));

      await expect(
        passwordService.hashPassword('password')
      ).rejects.toThrow('Failed to hash password');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      bcrypt.compare.mockResolvedValue(true);

      const result = await passwordService.comparePassword(
        'password',
        '$2a$10$hashedpassword'
      );

      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      bcrypt.compare.mockResolvedValue(false);

      const result = await passwordService.comparePassword(
        'wrongpassword',
        '$2a$10$hashedpassword'
      );

      expect(result).toBe(false);
    });

    it('should throw error if comparison fails', async () => {
      bcrypt.compare.mockRejectedValue(new Error('Comparison failed'));

      await expect(
        passwordService.comparePassword('password', 'hash')
      ).rejects.toThrow('Failed to compare password');
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong password', () => {
      const result = passwordService.validatePasswordStrength('StrongPass123!');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password that is too short', () => {
      const result = passwordService.validatePasswordStrength('Pass1!');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase', () => {
      const result = passwordService.validatePasswordStrength('password123!');

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('uppercase'))).toBe(true);
    });

    it('should reject password without lowercase', () => {
      const result = passwordService.validatePasswordStrength('PASSWORD123!');

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('lowercase'))).toBe(true);
    });

    it('should reject password without numbers', () => {
      const result = passwordService.validatePasswordStrength('Password!');

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('number'))).toBe(true);
    });

    it('should reject password without special characters', () => {
      const result = passwordService.validatePasswordStrength('Password123');

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('special character'))).toBe(true);
    });

    it('should accumulate all validation errors', () => {
      const result = passwordService.validatePasswordStrength('pass');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
