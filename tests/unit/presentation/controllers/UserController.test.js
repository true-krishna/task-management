const UserController = require('../../../../src/presentation/controllers/UserController');

describe('UserController', () => {
  let userController;
  let useCases;
  let mockLogger;
  let req, res, next;

  beforeEach(() => {
    useCases = {
      getUserProfile: { execute: jest.fn() },
      getAllUsers: { execute: jest.fn() },
      updateUserProfile: { execute: jest.fn() },
      updateUserRole: { execute: jest.fn() },
      deactivateUser: { execute: jest.fn() },
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    userController = new UserController({
      useCases,
      logger: mockLogger,
    });

    req = {
      user: { id: 'user123', role: 'user' },
      params: {},
      query: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      req.params.userId = 'user123';
      const mockUser = { id: 'user123', email: 'user@test.com' };

      useCases.getUserProfile.execute.mockResolvedValue(mockUser);

      await userController.getUserProfile(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });

    it('should handle errors', async () => {
      req.params.userId = 'user123';
      const error = new Error('Not found');
      useCases.getUserProfile.execute.mockRejectedValue(error);

      await userController.getUserProfile(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllUsers', () => {
    it('should get all users successfully', async () => {
      req.query = { role: 'user', isActive: 'true' };

      const mockUsers = [
        { id: 'user1', email: 'user1@test.com' },
        { id: 'user2', email: 'user2@test.com' },
      ];

      useCases.getAllUsers.execute.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUsers,
      });
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      req.params.userId = 'user123';
      req.body = { firstName: 'John', lastName: 'Updated' };

      const mockUser = { id: 'user123', firstName: 'John' };
      useCases.updateUserProfile.execute.mockResolvedValue(mockUser);

      await userController.updateUserProfile(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Profile updated successfully',
        data: mockUser,
      });
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      req.params.userId = 'user456';
      req.body = { role: 'admin' };

      const mockUser = { id: 'user456', role: 'admin' };
      useCases.updateUserRole.execute.mockResolvedValue(mockUser);

      await userController.updateUserRole(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User role updated successfully',
        data: mockUser,
      });
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      req.params.userId = 'user456';

      const mockUser = { id: 'user456', isActive: false };
      useCases.deactivateUser.execute.mockResolvedValue(mockUser);

      await userController.deactivateUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User deactivated successfully',
        data: mockUser,
      });
    });
  });
});
