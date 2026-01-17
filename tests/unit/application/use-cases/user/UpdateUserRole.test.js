const UpdateUserRole = require('../../../../../src/application/use-cases/user/UpdateUserRole');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('UpdateUserRole Use Case', () => {
  let updateUserRole;
  let mockUserRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockCacheService = {
      del: jest.fn(),
      delPattern: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    updateUserRole = new UpdateUserRole({
      userRepository: mockUserRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should update user role successfully', async () => {
    const userId = 'user123';
    const newRole = 'admin';
    const adminId = 'admin123';

    const mockUser = {
      id: userId,
      email: 'user@test.com',
      role: 'user',
    };

    const mockUpdatedUser = {
      ...mockUser,
      role: newRole,
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

    const result = await updateUserRole.execute(userId, newRole, adminId);

    expect(result.role).toBe(newRole);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, { role: newRole });
    expect(mockCacheService.del).toHaveBeenCalled();
  });

  it('should throw ValidationError for invalid role', async () => {
    await expect(
      updateUserRole.execute('user123', 'invalidrole', 'admin123')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      updateUserRole.execute('nonexistent', 'admin', 'admin123')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError for self role change', async () => {
    const userId = 'admin123';
    const mockUser = {
      id: userId,
      role: 'admin',
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);

    await expect(
      updateUserRole.execute(userId, 'user', userId)
    ).rejects.toThrow(ValidationError);
  });

  it('should handle role downgrade', async () => {
    const userId = 'admin456';
    const mockUser = {
      id: userId,
      role: 'admin',
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue({ ...mockUser, role: 'user' });

    const result = await updateUserRole.execute(userId, 'user', 'admin123');

    expect(result.role).toBe('user');
  });
});
