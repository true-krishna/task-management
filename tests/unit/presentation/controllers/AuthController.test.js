const AuthController = require('../../../../src/presentation/controllers/AuthController');

describe('AuthController', () => {
  let authController;
  let mockRegisterUser;
  let mockLoginUser;
  let mockRefreshToken;
  let mockLogoutUser;
  let mockVerifyToken;
  let mockLogger;
  let req, res, next;

  beforeEach(() => {
    mockRegisterUser = {
      execute: jest.fn(),
    };

    mockLoginUser = {
      execute: jest.fn(),
    };

    mockRefreshToken = {
      execute: jest.fn(),
    };

    mockLogoutUser = {
      execute: jest.fn(),
    };

    mockVerifyToken = {
      execute: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    authController = new AuthController({
      registerUser: mockRegisterUser,
      loginUser: mockLoginUser,
      refreshToken: mockRefreshToken,
      logoutUser: mockLogoutUser,
      verifyToken: mockVerifyToken,
      logger: mockLogger,
    });

    req = {
      body: {},
      ip: '127.0.0.1',
      connection: { remoteAddress: '127.0.0.1' },
      get: jest.fn(),
      user: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      req.body = {
        email: 'newuser@test.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockResult = {
        id: 'user123',
        email: 'newuser@test.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockRegisterUser.execute.mockResolvedValue(mockResult);

      await authController.register(req, res, next);

      expect(mockRegisterUser.execute).toHaveBeenCalledWith({
        email: 'newuser@test.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        avatar: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: mockResult,
      });
    });

    it('should call next with error on failure', async () => {
      req.body = { email: 'test@test.com', password: 'weak' };
      const error = new Error('Weak password');
      mockRegisterUser.execute.mockRejectedValue(error);

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      req.body = { email: 'user@test.com', password: 'Password123!' };
      req.get.mockReturnValue('Mozilla/5.0');

      const mockResult = {
        user: { id: 'user123', email: 'user@test.com' },
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };

      mockLoginUser.execute.mockResolvedValue(mockResult);

      await authController.login(req, res, next);

      expect(mockLoginUser.execute).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'Password123!',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: mockResult,
      });
    });

    it('should call next with error on failure', async () => {
      req.body = { email: 'user@test.com', password: 'wrong' };
      const error = new Error('Invalid credentials');
      mockLoginUser.execute.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('refresh', () => {
    it('should refresh token successfully', async () => {
      req.body = { refreshToken: 'refresh_token' };

      const mockResult = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      };

      mockRefreshToken.execute.mockResolvedValue(mockResult);

      await authController.refresh(req, res, next);

      expect(mockRefreshToken.execute).toHaveBeenCalledWith({
        refreshToken: 'refresh_token',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Token refreshed successfully',
        data: mockResult,
      });
    });

    it('should call next with error on failure', async () => {
      req.body = { refreshToken: 'invalid_token' };
      const error = new Error('Invalid token');
      mockRefreshToken.execute.mockRejectedValue(error);

      await authController.refresh(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      req.user = { id: 'user123' };
      req.body = { refreshToken: 'refresh_token' };

      mockLogoutUser.execute.mockResolvedValue(true);

      await authController.logout(req, res, next);

      expect(mockLogoutUser.execute).toHaveBeenCalledWith({
        userId: 'user123',
        refreshToken: 'refresh_token',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful',
      });
    });

    it('should call next with error on failure', async () => {
      req.user = { id: 'user123' };
      const error = new Error('Logout failed');
      mockLogoutUser.execute.mockRejectedValue(error);

      await authController.logout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('verify', () => {
    it('should verify token successfully', async () => {
      req.user = { id: 'user123', email: 'user@test.com', role: 'user' };

      await authController.verify(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Token is valid',
        data: { user: req.user },
      });
    });

    it('should handle errors', async () => {
      req.user = { id: 'user123' };
      const error = new Error('Verification failed');
      res.status.mockImplementation(() => {
        throw error;
      });

      await authController.verify(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
