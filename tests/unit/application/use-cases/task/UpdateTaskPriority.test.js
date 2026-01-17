const UpdateTaskPriority = require('../../../../../src/application/use-cases/task/UpdateTaskPriority');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('UpdateTaskPriority Use Case', () => {
  let updateTaskPriority;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockProjectRepository = {
      findById: jest.fn(),
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

    updateTaskPriority = new UpdateTaskPriority({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should update task priority successfully', async () => {
    const taskId = 'task123';
    const userId = 'user123';
    const newPriority = 'high';

    const mockTask = {
      id: taskId,
      projectId: 'project123',
      priority: 'low',
    };

    const mockProject = {
      id: 'project123',
      ownerId: userId,
      members: [],
    };

    const mockUpdatedTask = {
      ...mockTask,
      priority: newPriority,
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockTaskRepository.update.mockResolvedValue(mockUpdatedTask);

    const result = await updateTaskPriority.execute(taskId, userId, 'user', newPriority);

    expect(result.priority).toBe(newPriority);
    expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, {
      priority: newPriority,
      modifiedBy: userId,
    });
  });

  it('should throw ValidationError for invalid priority', async () => {
    await expect(
      updateTaskPriority.execute('task123', 'user123', 'user', 'invalid')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError if task does not exist', async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(
      updateTaskPriority.execute('nonexistent', 'user123', 'user', 'high')
    ).rejects.toThrow(NotFoundError);
  });

  it('should return task unchanged if priority is already the same', async () => {
    const mockTask = {
      id: 'task123',
      priority: 'high',
      projectId: 'project123',
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);

    const result = await updateTaskPriority.execute('task123', 'user123', 'user', 'high');

    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it('should throw AuthorizationError if user has no access', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
      priority: 'low',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'otheruser',
      members: [],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      updateTaskPriority.execute('task123', 'user123', 'user', 'high')
    ).rejects.toThrow(AuthorizationError);
  });
});
