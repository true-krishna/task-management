/**
 * Unit Tests for User Entity
 */
const User = require('../../../../src/domain/entities/User');
const UserRole = require('../../../../src/domain/enums/UserRole');
const ValidationError = require('../../../../src/domain/errors/ValidationError');

describe('User Entity', () => {
  describe('Constructor', () => {
    it('should create a user with valid data', () => {
      const userData = {
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = new User(userData);

      expect(user.id).toBe(userData.id);
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.role).toBe(UserRole.USER);
      expect(user.isActive).toBe(true);
    });

    it('should throw ValidationError for invalid email', () => {
      const userData = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'password123',
      };

      expect(() => new User(userData)).toThrow(ValidationError);
      expect(() => new User(userData)).toThrow('Invalid email format');
    });

    it('should throw ValidationError for missing email', () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
      };

      expect(() => new User(userData)).toThrow(ValidationError);
      expect(() => new User(userData)).toThrow('Email is required');
    });

    it('should throw ValidationError for missing username', () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(() => new User(userData)).toThrow(ValidationError);
      expect(() => new User(userData)).toThrow('Username is required');
    });

    it('should throw ValidationError for invalid role', () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        role: 'invalid_role',
      };

      expect(() => new User(userData)).toThrow(ValidationError);
      expect(() => new User(userData)).toThrow('Invalid user role');
    });

    it('should default role to USER if not provided', () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const user = new User(userData);
      expect(user.role).toBe(UserRole.USER);
    });

    it('should default isActive to true if not provided', () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const user = new User(userData);
      expect(user.isActive).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin users', () => {
      const user = new User({
        email: 'admin@example.com',
        username: 'admin',
        password: 'password',
        role: UserRole.ADMIN,
      });

      expect(user.isAdmin()).toBe(true);
    });

    it('should return false for regular users', () => {
      const user = new User({
        email: 'user@example.com',
        username: 'user',
        password: 'password',
        role: UserRole.USER,
      });

      expect(user.isAdmin()).toBe(false);
    });
  });

  describe('getFullName', () => {
    it('should return full name when both firstName and lastName are provided', () => {
      const user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.getFullName()).toBe('John Doe');
    });

    it('should return firstName only when lastName is not provided', () => {
      const user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        firstName: 'John',
      });

      expect(user.getFullName()).toBe('John');
    });

    it('should return username when neither firstName nor lastName is provided', () => {
      const user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      });

      expect(user.getFullName()).toBe('testuser');
    });
  });

  describe('toJSON', () => {
    it('should return user data without password', () => {
      const user = new User({
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
      });

      const json = user.toJSON();

      expect(json.id).toBe(user.id);
      expect(json.email).toBe(user.email);
      expect(json.username).toBe(user.username);
      expect(json.firstName).toBe(user.firstName);
      expect(json.password).toBeUndefined();
    });
  });
});
