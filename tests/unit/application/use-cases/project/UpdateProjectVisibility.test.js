const UpdateProjectVisibility = require('../../../../../src/application/use-cases/project/UpdateProjectVisibility');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');
const ProjectVisibility = require('../../../../../src/domain/enums/ProjectVisibility');

describe('UpdateProjectVisibility Use Case', () => {
  let updateProjectVisibility;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockProjectRepository = {
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

    updateProjectVisibility = new UpdateProjectVisibility({
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should update project visibility successfully as owner', async () => {
    const projectId = 'project123';
    const userId = 'owner123';
    const newVisibility = ProjectVisibility.PUBLIC;

    const mockProject = {
      id: projectId,
      ownerId: userId,
      visibility: ProjectVisibility.PRIVATE,
    };

    const mockUpdatedProject = {
      ...mockProject,
      visibility: newVisibility,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.update.mockResolvedValue(mockUpdatedProject);

    const result = await updateProjectVisibility.execute(
      projectId,
      userId,
      'user',
      newVisibility
    );

    expect(result.visibility).toBe(newVisibility);
    expect(mockProjectRepository.update).toHaveBeenCalledWith(projectId, {
      visibility: newVisibility,
      modifiedBy: userId,
    });
  });

  it('should allow admin to update any project visibility', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner456',
      visibility: ProjectVisibility.PRIVATE,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.update.mockResolvedValue(mockProject);

    await updateProjectVisibility.execute(
      'project123',
      'admin789',
      'admin',
      ProjectVisibility.PUBLIC
    );

    expect(mockProjectRepository.update).toHaveBeenCalled();
  });

  it('should throw ValidationError for invalid visibility', async () => {
    await expect(
      updateProjectVisibility.execute('project123', 'user123', 'user', 'invalid')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError if project does not exist', async () => {
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      updateProjectVisibility.execute('nonexistent', 'user123', 'user', ProjectVisibility.PUBLIC)
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user is not owner or admin', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner456',
      visibility: ProjectVisibility.PRIVATE,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      updateProjectVisibility.execute('project123', 'user123', 'user', ProjectVisibility.PUBLIC)
    ).rejects.toThrow(AuthorizationError);
  });

  it('should throw ValidationError if visibility is already the same', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      visibility: ProjectVisibility.PUBLIC,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      updateProjectVisibility.execute('project123', 'owner123', 'user', ProjectVisibility.PUBLIC)
    ).rejects.toThrow(ValidationError);
  });

  it('should invalidate relevant caches', async () => {
    const projectId = 'project123';
    const mockProject = {
      id: projectId,
      ownerId: 'owner123',
      visibility: ProjectVisibility.PRIVATE,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.update.mockResolvedValue(mockProject);

    await updateProjectVisibility.execute(
      projectId,
      'owner123',
      'user',
      ProjectVisibility.PUBLIC
    );

    expect(mockCacheService.del).toHaveBeenCalledWith(`project:${projectId}`);
    expect(mockCacheService.delPattern).toHaveBeenCalledWith('project:user:*');
  });
});
