const LogoutUser = require('../../../../../src/application/use-cases/auth/LogoutUser');

describe('LogoutUser Use Case', () => {
  let logoutUser;
  let mockRefreshTokenRepository;
  let mockTokenService;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockRefreshTokenRepository = {
      revoke: jest.fn(),
    };

    mockTokenService = {
      hashToken: jest.fn(),
    };

    mockCacheService = {
      del: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    logoutUser = new LogoutUser({
      refreshTokenRepository: mockRefreshTokenRepository,
      tokenService: mockTokenService,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should logout user successfully with refresh token', async () => {
    const refreshToken = 'refresh-token';
    const hashedToken = 'hashed-token';
    const userId = 'user123';

    mockTokenService.hashToken.mockReturnValue(hashedToken);
    mockRefreshTokenRepository.revoke.mockResolvedValue();
    mockCacheService.del.mockResolvedValue();

    const result = await logoutUser.execute({ refreshToken, userId });

    expect(result.success).toBe(true);
    expect(mockRefreshTokenRepository.revoke).toHaveBeenCalledWith(hashedToken);
    expect(mockCacheService.del).toHaveBeenCalledWith(`user:profile:${userId}`);
  });

  it('should logout user without refresh token', async () => {
    const userId = 'user123';

    mockCacheService.del.mockResolvedValue();

    const result = await logoutUser.execute({ userId });

    expect(result.success).toBe(true);
    expect(mockRefreshTokenRepository.revoke).not.toHaveBeenCalled();
    expect(mockCacheService.del).toHaveBeenCalled();
  });

  it('should handle logout without userId', async () => {
    const refreshToken = 'refresh-token';

    mockTokenService.hashToken.mockReturnValue('hashed');
    mockRefreshTokenRepository.revoke.mockResolvedValue();

    const result = await logoutUser.execute({ refreshToken });

    expect(result.success).toBe(true);
    expect(mockCacheService.del).not.toHaveBeenCalled();
  });

  it('should logout successfully with no parameters', async () => {
    const result = await logoutUser.execute({});

    expect(result.success).toBe(true);
    expect(mockRefreshTokenRepository.revoke).not.toHaveBeenCalled();
    expect(mockCacheService.del).not.toHaveBeenCalled();
  });
});
