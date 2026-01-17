const GetProjectTasks = require('../../../../../src/application/use-cases/task/GetProjectTasks');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('GetProjectTasks Use Case', () => {
  let getProjectTasks;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      findAll: jest.fn(),
    };

    mockProjectRepository = {
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

    getProjectTasks = new GetProjectTasks({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should retrieve project tasks successfully', async () => {
    const projectId = 'project123';
    const userId = 'user123';

    const mockProject = {
      id: projectId,
      ownerId: userId,
      members: [],
    };

    const mockTasks = [
      { id: 'task1', projectId, status: 'not_started', title: 'Task 1' },
      { id: 'task2', projectId, status: 'in_progress', title: 'Task 2' },
    ];

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockCacheService.get.mockResolvedValue(null);
    mockTaskRepository.findAll.mockResolvedValue(mockTasks);

    const result = await getProjectTasks.execute(projectId, userId, 'user');

    expect(result).toBeDefined();
    expect(mockTaskRepository.findAll).toHaveBeenCalledWith(
      { projectId },
      expect.any(Object)
    );
  });

  it('should return cached tasks if available', async () => {
    const projectId = 'project123';
    const userId = 'user123';

    const mockProject = {
      id: projectId,
      ownerId: userId,
      members: [],
    };

    const cachedTasks = JSON.stringify({
      not_started: [],
      in_progress: [],
      completed: [],
    });

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockCacheService.get.mockResolvedValue(cachedTasks);

    const result = await getProjectTasks.execute(projectId, userId, 'user');

    expect(result).toBeDefined();
    expect(mockTaskRepository.findAll).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError if project does not exist', async () => {
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      getProjectTasks.execute('nonexistent', 'user123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user has no access', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'otheruser',
      members: [],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      getProjectTasks.execute('project123', 'user123', 'user')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should filter tasks by status', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'user123',
      members: [],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockCacheService.get.mockResolvedValue(null);
    mockTaskRepository.findAll.mockResolvedValue([]);

    await getProjectTasks.execute('project123', 'user123', 'user', { status: 'in_progress' });

    expect(mockTaskRepository.findAll).toHaveBeenCalledWith(
      { projectId: 'project123', status: 'in_progress' },
      expect.any(Object)
    );
  });

  it('should allow member to access tasks', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: ['user123'],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockCacheService.get.mockResolvedValue(null);
    mockTaskRepository.findAll.mockResolvedValue([]);

    const result = await getProjectTasks.execute('project123', 'user123', 'user');

    expect(result).toBeDefined();
  });
});
