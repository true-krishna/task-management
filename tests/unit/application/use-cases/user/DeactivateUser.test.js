const DeactivateUser = require('../../../../../src/application/use-cases/user/DeactivateUser');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('DeactivateUser Use Case', () => {
  let deactivateUser;
  let mockUserRepository;
  let mockRefreshTokenRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockRefreshTokenRepository = {
      revokeAllForUser: jest.fn(),
    };

    mockCacheService = {
      del: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    deactivateUser = new DeactivateUser({
      userRepository: mockUserRepository,
      refreshTokenRepository: mockRefreshTokenRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should deactivate user successfully', async () => {
    const userId = 'user123';
    const adminId = 'admin123';

    const mockUser = {
      id: userId,
      email: 'user@test.com',
      isActive: true,
    };

    const mockUpdatedUser = {
      ...mockUser,
      isActive: false,
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUpdatedUser);
    mockRefreshTokenRepository.revokeAllForUser.mockResolvedValue();

    const result = await deactivateUser.execute(userId, adminId);

    expect(result.user.isActive).toBe(false);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, { isActive: false });
    expect(mockRefreshTokenRepository.revokeAllForUser).toHaveBeenCalledWith(userId);
    expect(mockCacheService.del).toHaveBeenCalled();
  });

  it('should throw NotFoundError if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      deactivateUser.execute('nonexistent', 'admin123')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError for self-deactivation', async () => {
    const userId = 'admin123';
    const mockUser = {
      id: userId,
      isActive: true,
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);

    await expect(
      deactivateUser.execute(userId, userId)
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError if user already deactivated', async () => {
    const mockUser = {
      id: 'user123',
      isActive: false,
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);

    await expect(
      deactivateUser.execute('user123', 'admin123')
    ).rejects.toThrow(ValidationError);
  });
});
