const DeleteProject = require('../../../../../src/application/use-cases/project/DeleteProject');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('DeleteProject Use Case', () => {
  let deleteProject;
  let mockProjectRepository;
  let mockLogger;

  beforeEach(() => {
    mockProjectRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    deleteProject = new DeleteProject({
      projectRepository: mockProjectRepository,
      cacheService: { del: jest.fn(), delPattern: jest.fn() },
      logger: mockLogger,
    });
  });

  it('should delete project successfully as owner', async () => {
    const projectId = 'project123';
    const userId = 'user123';

    const mockProject = {
      id: projectId,
      ownerId: userId,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.delete.mockResolvedValue();

    const result = await deleteProject.execute(projectId, userId, 'user');

    expect(result).toEqual({ success: true, message: 'Project deleted successfully' });
    expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectId);
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it('should allow admin to delete any project', async () => {
    const projectId = 'project123';
    const userId = 'admin123';

    const mockProject = {
      id: projectId,
      ownerId: 'otheruser',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockProjectRepository.delete.mockResolvedValue();

    const result = await deleteProject.execute(projectId, userId, 'admin');

    expect(result).toEqual({ success: true, message: 'Project deleted successfully' });
  });

  it('should throw NotFoundError if project does not exist', async () => {
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      deleteProject.execute('nonexistent', 'user123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user is not owner or admin', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'otheruser',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      deleteProject.execute('project123', 'user123', 'user')
    ).rejects.toThrow(AuthorizationError);
  });
});
