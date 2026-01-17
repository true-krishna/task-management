const RemoveUserFromProject = require('../../../../../src/application/use-cases/project/RemoveUserFromProject');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('RemoveUserFromProject Use Case', () => {
  let removeUserFromProject;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockProjectRepository = {
      findById: jest.fn(),
      removeMember: jest.fn(),
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

    removeUserFromProject = new RemoveUserFromProject({
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should remove user from project successfully as owner', async () => {
    const projectId = 'project123';
    const ownerId = 'owner123';
    const memberToRemove = 'member456';

    const mockProject = {
      id: projectId,
      ownerId,
      members: [memberToRemove, 'othermember'],
    };

    const mockUpdatedProject = {
      ...mockProject,
      members: ['othermember'],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.removeMember.mockResolvedValue(mockUpdatedProject);

    const result = await removeUserFromProject.execute(
      projectId,
      memberToRemove,
      ownerId,
      'user'
    );

    expect(result.members).not.toContain(memberToRemove);
    expect(mockProjectRepository.removeMember).toHaveBeenCalledWith(projectId, memberToRemove);
  });

  it('should allow admin to remove user from any project', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner456',
      members: ['member123', 'member456'],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.removeMember.mockResolvedValue(mockProject);

    await removeUserFromProject.execute('project123', 'member123', 'admin789', 'admin');

    expect(mockProjectRepository.removeMember).toHaveBeenCalled();
  });

  it('should throw NotFoundError if project does not exist', async () => {
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      removeUserFromProject.execute('nonexistent', 'member123', 'owner123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user is not owner or admin', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner456',
      members: ['member123'],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      removeUserFromProject.execute('project123', 'member123', 'randomuser', 'user')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should throw ValidationError when trying to remove owner', async () => {
    const ownerId = 'owner123';
    const mockProject = {
      id: 'project123',
      ownerId,
      members: [ownerId, 'member456'],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      removeUserFromProject.execute('project123', ownerId, ownerId, 'user')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError if user is not a member', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: ['member456'],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      removeUserFromProject.execute('project123', 'nonmember', 'owner123', 'user')
    ).rejects.toThrow(ValidationError);
  });

  it('should invalidate relevant caches', async () => {
    const projectId = 'project123';
    const mockProject = {
      id: projectId,
      ownerId: 'owner123',
      members: ['member456'],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.removeMember.mockResolvedValue(mockProject);

    await removeUserFromProject.execute(projectId, 'member456', 'owner123', 'user');

    expect(mockCacheService.del).toHaveBeenCalledWith(`project:${projectId}`);
    expect(mockCacheService.delPattern).toHaveBeenCalledWith(`project:user:member456:*`);
    expect(mockCacheService.delPattern).toHaveBeenCalledWith(`project:user:owner123:*`);
  });
});
