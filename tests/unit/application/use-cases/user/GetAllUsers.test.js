const GetAllUsers = require('../../../../../src/application/use-cases/user/GetAllUsers');

describe('GetAllUsers Use Case', () => {
  let getAllUsers;
  let mockUserRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockUserRepository = {
      findAll: jest.fn(),
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

    getAllUsers = new GetAllUsers({
      userRepository: mockUserRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should retrieve all users successfully', async () => {
    const mockUsers = [
      { id: 'user1', email: 'user1@test.com', role: 'user' },
      { id: 'user2', email: 'user2@test.com', role: 'admin' },
    ];

    mockCacheService.get.mockResolvedValue(null);
    mockUserRepository.findAll.mockResolvedValue(mockUsers);

    const result = await getAllUsers.execute();

    expect(result.users).toHaveLength(2);
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should return cached users if available', async () => {
    const cachedData = JSON.stringify({
      users: [{ id: 'user1', email: 'cached@test.com' }],
      pagination: { page: 1, limit: 50, total: 1 },
    });

    mockCacheService.get.mockResolvedValue(cachedData);

    const result = await getAllUsers.execute();

    expect(result.users).toHaveLength(1);
    expect(mockUserRepository.findAll).not.toHaveBeenCalled();
  });

  it('should filter by role', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockUserRepository.findAll.mockResolvedValue([]);

    await getAllUsers.execute({ role: 'admin' });

    expect(mockUserRepository.findAll).toHaveBeenCalledWith(
      { role: 'admin' },
      expect.any(Object)
    );
  });

  it('should filter by isActive', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockUserRepository.findAll.mockResolvedValue([]);

    await getAllUsers.execute({ isActive: true });

    expect(mockUserRepository.findAll).toHaveBeenCalledWith(
      { isActive: true },
      expect.any(Object)
    );
  });

  it('should support pagination', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockUserRepository.findAll.mockResolvedValue([]);

    await getAllUsers.execute({ page: 2, limit: 10 });

    expect(mockUserRepository.findAll).toHaveBeenCalledWith(
      {},
      { page: 2, limit: 10 }
    );
  });
});
