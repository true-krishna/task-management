const GetTask = require('../../../../../src/application/use-cases/task/GetTask');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('GetTask Use Case', () => {
  let getTask;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      findById: jest.fn(),
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

    getTask = new GetTask({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should retrieve task successfully', async () => {
    const taskId = 'task123';
    const userId = 'user123';

    const mockTask = {
      id: taskId,
      title: 'Test Task',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: userId,
      members: [],
    };

    mockCacheService.get.mockResolvedValue(null);
    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await getTask.execute(taskId, userId, 'user');

    expect(result).toEqual(mockTask);
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should return cached task if available', async () => {
    const taskId = 'task123';
    const userId = 'user123';

    const mockTask = {
      id: taskId,
      title: 'Cached Task',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: userId,
      members: [],
    };

    mockCacheService.get.mockResolvedValue(JSON.stringify(mockTask));
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await getTask.execute(taskId, userId, 'user');

    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError if task does not exist', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(
      getTask.execute('nonexistent', 'user123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user has no access', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'otheruser',
      members: [],
    };

    mockCacheService.get.mockResolvedValue(null);
    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      getTask.execute('task123', 'user123', 'user')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should allow project member to access task', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: ['user123'],
    };

    mockCacheService.get.mockResolvedValue(null);
    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await getTask.execute('task123', 'user123', 'user');

    expect(result).toEqual(mockTask);
  });
});
