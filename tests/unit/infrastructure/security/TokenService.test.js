const TokenService = require('../../../../src/infrastructure/security/TokenService');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('TokenService', () => {
  let tokenService;
  let mockLogger;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };

    tokenService = new TokenService(mockLogger);
  });

  describe('generateAccessToken', () => {
    it('should generate access token successfully', () => {
      const user = { id: 'user123', email: 'user@test.com', role: 'user' };
      const token = 'generated_access_token';

      jwt.sign.mockReturnValue(token);

      const result = tokenService.generateAccessToken(user);

      expect(result).toBe(token);
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user123',
          email: 'user@test.com',
          role: 'user',
          type: 'access',
        }),
        expect.any(String),
        expect.objectContaining({ expiresIn: expect.any(String) })
      );
    });

    it('should throw error if generation fails', () => {
      jwt.sign.mockImplementation(() => {
        throw new Error('JWT Error');
      });

      expect(() => {
        tokenService.generateAccessToken({ id: 'user123' });
      }).toThrow('Failed to generate access token');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token successfully', () => {
      const user = { id: 'user123', email: 'user@test.com' };
      const token = 'generated_refresh_token';

      jwt.sign.mockReturnValue(token);

      const result = tokenService.generateRefreshToken(user);

      expect(result).toBe(token);
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user123',
          email: 'user@test.com',
          type: 'refresh',
        }),
        expect.any(String),
        expect.objectContaining({ expiresIn: expect.any(String) })
      );
    });

    it('should throw error if generation fails', () => {
      jwt.sign.mockImplementation(() => {
        throw new Error('JWT Error');
      });

      expect(() => {
        tokenService.generateRefreshToken({ id: 'user123' });
      }).toThrow('Failed to generate refresh token');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify access token successfully', () => {
      const decoded = {
        userId: 'user123',
        email: 'user@test.com',
        role: 'user',
        type: 'access',
      };

      jwt.verify.mockReturnValue(decoded);

      const result = tokenService.verifyAccessToken('valid_token');

      expect(result).toEqual(decoded);
    });

    it('should throw error for invalid token type', () => {
      jwt.verify.mockReturnValue({
        userId: 'user123',
        type: 'refresh',
      });

      expect(() => {
        tokenService.verifyAccessToken('token');
      }).toThrow('Invalid token type');
    });

    it('should throw error for invalid token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => {
        tokenService.verifyAccessToken('invalid_token');
      }).toThrow('Invalid or expired token');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token successfully', () => {
      const decoded = {
        userId: 'user123',
        email: 'user@test.com',
        type: 'refresh',
      };

      jwt.verify.mockReturnValue(decoded);

      const result = tokenService.verifyRefreshToken('valid_token');

      expect(result).toEqual(decoded);
    });

    it('should throw error for invalid token type', () => {
      jwt.verify.mockReturnValue({
        userId: 'user123',
        type: 'access',
      });

      expect(() => {
        tokenService.verifyRefreshToken('token');
      }).toThrow('Invalid token type');
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', () => {
      const user = { id: 'user123', email: 'user@test.com', role: 'user' };

      jwt.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

      const result = tokenService.generateTokenPair(user);

      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
    });
  });
});
