const UpdateUserProfile = require('../../../../../src/application/use-cases/user/UpdateUserProfile');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('UpdateUserProfile Use Case', () => {
  let updateUserProfile;
  let mockUserRepository;
  let mockLogger;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    updateUserProfile = new UpdateUserProfile({
      userRepository: mockUserRepository,
      cacheService: { del: jest.fn() },
      logger: mockLogger,
    });
  });

  it('should update user profile successfully', async () => {
    const userId = 'user123';
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    const mockUser = {
      id: userId,
      email: 'user@test.com',
    };

    const mockUpdatedUser = {
      ...mockUser,
      ...updateData,
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

    const result = await updateUserProfile.execute(userId, updateData);

    expect(result).toEqual(mockUpdatedUser);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
  });

  it('should filter out invalid fields', async () => {
    const userId = 'user123';
    const updateData = {
      firstName: 'Updated',
      role: 'admin', // Should be filtered out
      email: 'new@email.com', // Should be filtered out
    };

    const mockUser = {
      id: userId,
      email: 'user@test.com',
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);

    await updateUserProfile.execute(userId, updateData);

    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
      firstName: 'Updated',
    });
  });

  it('should throw NotFoundError if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      updateUserProfile.execute('nonexistent', { firstName: 'Test' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError if no fields provided', async () => {
    await expect(
      updateUserProfile.execute('user123', {})
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError if only invalid fields provided', async () => {
    const mockUser = {
      id: 'user123',
      email: 'user@test.com',
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);

    await expect(
      updateUserProfile.execute('user123', { invalidField: 'value' })
    ).rejects.toThrow(ValidationError);
  });
});
