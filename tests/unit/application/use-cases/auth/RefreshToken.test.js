const RefreshTokenUseCase = require('../../../../../src/application/use-cases/auth/RefreshToken');
const AuthenticationError = require('../../../../../src/domain/errors/AuthenticationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('RefreshToken Use Case', () => {
  let refreshTokenUseCase;
  let mockUserRepository;
  let mockRefreshTokenRepository;
  let mockTokenService;
  let mockLogger;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
    };

    mockRefreshTokenRepository = {
      findByToken: jest.fn(),
      revoke: jest.fn(),
      create: jest.fn(),
    };

    mockTokenService = {
      verifyRefreshToken: jest.fn(),
      hashToken: jest.fn(),
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      getExpirationDate: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    refreshTokenUseCase = new RefreshTokenUseCase({
      userRepository: mockUserRepository,
      refreshTokenRepository: mockRefreshTokenRepository,
      tokenService: mockTokenService,
      logger: mockLogger,
    });
  });

  it('should refresh tokens successfully', async () => {
    const refreshToken = 'old-refresh-token';
    const hashedToken = 'hashed-token';
    const userId = 'user123';

    const mockDecodedToken = { userId };
    const mockStoredToken = { userId, token: hashedToken };
    const mockUser = { id: userId, email: 'user@test.com', isActive: true };
    const newAccessToken = 'new-access-token';
    const newRefreshToken = 'new-refresh-token';

    mockTokenService.verifyRefreshToken.mockReturnValue(mockDecodedToken);
    mockTokenService.hashToken.mockReturnValue(hashedToken);
    mockRefreshTokenRepository.findByToken.mockResolvedValue(mockStoredToken);
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockTokenService.generateAccessToken.mockReturnValue(newAccessToken);
    mockTokenService.generateRefreshToken.mockReturnValue(newRefreshToken);
    mockTokenService.getExpirationDate.mockReturnValue(new Date());

    const result = await refreshTokenUseCase.execute({ refreshToken });

    expect(result.accessToken).toBe(newAccessToken);
    expect(result.refreshToken).toBe(newRefreshToken);
    expect(mockRefreshTokenRepository.revoke).toHaveBeenCalledWith(hashedToken);
  });

  it('should throw ValidationError if refresh token is missing', async () => {
    await expect(
      refreshTokenUseCase.execute({})
    ).rejects.toThrow(ValidationError);
  });

  it('should throw AuthenticationError for invalid token', async () => {
    mockTokenService.verifyRefreshToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(
      refreshTokenUseCase.execute({ refreshToken: 'invalid' })
    ).rejects.toThrow(AuthenticationError);
  });

  it('should throw AuthenticationError if token not found in database', async () => {
    mockTokenService.verifyRefreshToken.mockReturnValue({ userId: 'user123' });
    mockTokenService.hashToken.mockReturnValue('hashed');
    mockRefreshTokenRepository.findByToken.mockResolvedValue(null);

    await expect(
      refreshTokenUseCase.execute({ refreshToken: 'token' })
    ).rejects.toThrow(AuthenticationError);
  });
});
