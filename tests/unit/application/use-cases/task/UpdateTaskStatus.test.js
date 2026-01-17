const UpdateTaskStatus = require('../../../../../src/application/use-cases/task/UpdateTaskStatus');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('UpdateTaskStatus Use Case', () => {
  let updateTaskStatus;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      getMaxOrder: jest.fn(),
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

    updateTaskStatus = new UpdateTaskStatus({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should update task status successfully', async () => {
    const taskId = 'task123';
    const userId = 'user123';
    const newStatus = 'in_progress';

    const mockTask = {
      id: taskId,
      projectId: 'project123',
      status: 'not_started',
    };

    const mockProject = {
      id: 'project123',
      ownerId: userId,
      members: [],
    };

    const mockUpdatedTask = {
      ...mockTask,
      status: newStatus,
      order: 1,
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockTaskRepository.getMaxOrder.mockResolvedValue(0);
    mockTaskRepository.update.mockResolvedValue(mockUpdatedTask);

    const result = await updateTaskStatus.execute(taskId, userId, 'user', newStatus);

    expect(result.status).toBe(newStatus);
    expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, {
      status: newStatus,
      order: 1,
      modifiedBy: userId,
    });
  });

  it('should throw ValidationError for invalid status', async () => {
    await expect(
      updateTaskStatus.execute('task123', 'user123', 'user', 'invalid_status')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError if task does not exist', async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(
      updateTaskStatus.execute('nonexistent', 'user123', 'user', 'completed')
    ).rejects.toThrow(NotFoundError);
  });

  it('should return task unchanged if status is already the same', async () => {
    const mockTask = {
      id: 'task123',
      status: 'completed',
      projectId: 'project123',
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);

    const result = await updateTaskStatus.execute('task123', 'user123', 'user', 'completed');

    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it('should throw AuthorizationError if user has no access', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
      status: 'not_started',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'otheruser',
      members: [],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      updateTaskStatus.execute('task123', 'user123', 'user', 'completed')
    ).rejects.toThrow(AuthorizationError);
  });
});
