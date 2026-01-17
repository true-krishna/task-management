const UpdateProject = require('../../../../../src/application/use-cases/project/UpdateProject');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('UpdateProject Use Case', () => {
  let updateProject;
  let mockProjectRepository;
  let mockLogger;

  beforeEach(() => {
    mockProjectRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    updateProject = new UpdateProject({
      projectRepository: mockProjectRepository,
      cacheService: { del: jest.fn(), delPattern: jest.fn() },
      logger: mockLogger,
    });
  });

  it('should update project successfully as owner', async () => {
    const projectId = 'project123';
    const userId = 'user123';
    const updateData = {
      name: 'Updated Name',
      description: 'Updated Description',
    };

    const mockProject = {
      id: projectId,
      ownerId: userId,
    };

    const mockUpdatedProject = {
      ...mockProject,
      ...updateData,
      modifiedBy: userId,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.update.mockResolvedValue(mockUpdatedProject);

    const result = await updateProject.execute(projectId, userId, 'user', updateData);

    expect(result).toEqual(mockUpdatedProject);
    expect(mockProjectRepository.update).toHaveBeenCalledWith(projectId, {
      ...updateData,
      modifiedBy: userId,
    });
  });

  it('should allow admin to update any project', async () => {
    const projectId = 'project123';
    const userId = 'admin123';
    const updateData = { name: 'Updated by Admin' };

    const mockProject = {
      id: projectId,
      ownerId: 'otheruser',
    };

    const mockUpdatedProject = {
      ...mockProject,
      ...updateData,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.update.mockResolvedValue(mockUpdatedProject);

    const result = await updateProject.execute(projectId, userId, 'admin', updateData);

    expect(result).toEqual(mockUpdatedProject);
  });

  it('should throw NotFoundError if project does not exist', async () => {
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      updateProject.execute('nonexistent', 'user123', 'user', { name: 'Test' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user is not owner or admin', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'otheruser',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      updateProject.execute('project123', 'user123', 'user', { name: 'Test' })
    ).rejects.toThrow(AuthorizationError);
  });

  it('should filter out invalid fields', async () => {
    const projectId = 'project123';
    const userId = 'user123';
    const updateData = {
      name: 'Updated Name',
      invalidField: 'Should be ignored',
      visibility: 'Should be ignored',
    };

    const mockProject = {
      id: projectId,
      ownerId: userId,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.update.mockResolvedValue({});

    await updateProject.execute(projectId, userId, 'user', updateData);

    expect(mockProjectRepository.update).toHaveBeenCalledWith(projectId, {
      name: 'Updated Name',
      modifiedBy: userId,
    });
  });

  it('should throw ValidationError if no valid fields provided', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'user123',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      updateProject.execute('project123', 'user123', 'user', { invalidField: 'value' })
    ).rejects.toThrow(ValidationError);
  });
});
