const LoginUser = require('../../../../../src/application/use-cases/auth/LoginUser');
const AuthenticationError = require('../../../../../src/domain/errors/AuthenticationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('LoginUser Use Case', () => {
  let loginUser;
  let mockUserRepository;
  let mockRefreshTokenRepository;
  let mockPasswordService;
  let mockTokenService;
  let mockLogger;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      updateLastLogin: jest.fn(),
    };

    mockRefreshTokenRepository = {
      create: jest.fn(),
    };

    mockPasswordService = {
      comparePassword: jest.fn(),
    };

    mockTokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      hashToken: jest.fn(),
      getExpirationDate: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    loginUser = new LoginUser({
      userRepository: mockUserRepository,
      refreshTokenRepository: mockRefreshTokenRepository,
      passwordService: mockPasswordService,
      tokenService: mockTokenService,
      cacheService: { set: jest.fn() },
      logger: mockLogger,
    });
  });

  it('should login user successfully', async () => {
    const loginData = {
      email: 'user@test.com',
      password: 'password123',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    };

    const mockUser = {
      id: 'user123',
      email: loginData.email,
      password: 'hashedpassword',
      isActive: true,
      role: 'user',
    };

    const accessToken = 'access-token';
    const refreshToken = 'refresh-token';
    const hashedRefreshToken = 'hashed-refresh-token';

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockPasswordService.comparePassword.mockResolvedValue(true);
    mockTokenService.generateAccessToken.mockReturnValue(accessToken);
    mockTokenService.generateRefreshToken.mockReturnValue(refreshToken);
    mockTokenService.hashToken.mockReturnValue(hashedRefreshToken);
    mockTokenService.getExpirationDate.mockReturnValue(new Date());
    mockRefreshTokenRepository.create.mockResolvedValue();
    mockUserRepository.updateLastLogin.mockResolvedValue();

    const result = await loginUser.execute(loginData);

    expect(result.accessToken).toBe(accessToken);
    expect(result.refreshToken).toBe(refreshToken);
    expect(result.user).toBeDefined();
    expect(result.user.password).toBeUndefined(); // Password should be removed
    expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password
    );
    expect(mockRefreshTokenRepository.create).toHaveBeenCalled();
    expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
  });

  it('should throw AuthenticationError for non-existent user', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      loginUser.execute({ email: 'nonexistent@test.com', password: 'password' })
    ).rejects.toThrow(AuthenticationError);
  });

  it('should throw AuthenticationError for inactive user', async () => {
    const mockUser = {
      id: 'user123',
      email: 'user@test.com',
      isActive: false,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(
      loginUser.execute({ email: 'user@test.com', password: 'password' })
    ).rejects.toThrow(AuthenticationError);
  });

  it('should throw AuthenticationError for invalid password', async () => {
    const mockUser = {
      id: 'user123',
      email: 'user@test.com',
      password: 'hashedpassword',
      isActive: true,
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockPasswordService.comparePassword.mockResolvedValue(false);

    await expect(
      loginUser.execute({ email: 'user@test.com', password: 'wrongpassword' })
    ).rejects.toThrow(AuthenticationError);

    expect(mockLogger.warn).toHaveBeenCalled();
  });

  it('should throw ValidationError for missing email', async () => {
    await expect(
      loginUser.execute({ password: 'password123' })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for missing password', async () => {
    await expect(
      loginUser.execute({ email: 'user@test.com' })
    ).rejects.toThrow(ValidationError);
  });
});
