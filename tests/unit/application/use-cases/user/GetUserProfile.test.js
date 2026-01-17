const GetUserProfile = require('../../../../../src/application/use-cases/user/GetUserProfile');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');

describe('GetUserProfile Use Case', () => {
  let getUserProfile;
  let mockUserRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    getUserProfile = new GetUserProfile({
      userRepository: mockUserRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should retrieve user profile successfully', async () => {
    const userId = 'user123';

    const mockUser = {
      id: userId,
      email: 'user@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      isActive: true,
      password: 'hashedpassword',
    };

    mockCacheService.get.mockResolvedValue(null);
    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await getUserProfile.execute(userId);

    expect(result.id).toBe(userId);
    expect(result.email).toBe('user@test.com');
    expect(result.password).toBeUndefined();
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should return cached profile if available', async () => {
    const userId = 'user123';
    const cachedProfile = JSON.stringify({
      id: userId,
      email: 'cached@test.com',
      firstName: 'Cached',
      lastName: 'User',
    });

    mockCacheService.get.mockResolvedValue(cachedProfile);

    const result = await getUserProfile.execute(userId);

    expect(result.email).toBe('cached@test.com');
    expect(mockUserRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError if user does not exist', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      getUserProfile.execute('nonexistent')
    ).rejects.toThrow(NotFoundError);
  });
});
