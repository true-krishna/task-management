/**
 * Unit Tests for User Entity
 */
const User = require('../../../../src/domain/entities/User');

describe('User Entity', () => {
  describe('Constructor', () => {
    it('should create a user with all properties', () => {
      const userData = {
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
      };

      const user = new User(userData);

      expect(user.id).toBe(userData.id);
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.role).toBe('user');
      expect(user.isActive).toBe(true);
    });

    it('should use default values', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.avatar).toBeNull();
      expect(user.role).toBe('user');
      expect(user.isActive).toBe(true);
      expect(user.lastLoginAt).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      const user = new User({
        email: 'admin@example.com',
        password: 'password',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      });

      expect(user.isAdmin()).toBe(true);
    });

    it('should return false for user role', () => {
      const user = new User({
        email: 'user@example.com',
        password: 'password',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
      });

      expect(user.isAdmin()).toBe(false);
    });
  });

  describe('getFullName', () => {
    it('should return full name', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.getFullName()).toBe('John Doe');
    });

    it('should trim spaces', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: '',
      });

      expect(user.getFullName()).toBe('John');
    });
  });

  describe('isUserActive', () => {
    it('should return true for active users', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
      });

      expect(user.isUserActive()).toBe(true);
    });

    it('should return false for inactive users', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        isActive: false,
      });

      expect(user.isUserActive()).toBe(false);
    });
  });
});
