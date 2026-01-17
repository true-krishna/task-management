const ReorderTasks = require('../../../../../src/application/use-cases/task/ReorderTasks');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('ReorderTasks Use Case', () => {
  let reorderTasks;
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

    reorderTasks = new ReorderTasks({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should reorder task successfully', async () => {
    const taskId = 'task123';
    const userId = 'user123';

    const mockTask = {
      id: taskId,
      projectId: 'project123',
      status: 'not_started',
      order: 0,
    };

    const mockProject = {
      id: 'project123',
      ownerId: userId,
      members: [],
    };

    const mockUpdatedTask = {
      ...mockTask,
      status: 'in_progress',
      order: 2,
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockTaskRepository.update.mockResolvedValue(mockUpdatedTask);

    const result = await reorderTasks.execute(taskId, userId, 'user', {
      newStatus: 'in_progress',
      newOrder: 2,
    });

    expect(result.status).toBe('in_progress');
    expect(result.order).toBe(2);
    expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, {
      status: 'in_progress',
      order: 2,
      modifiedBy: userId,
    });
  });

  it('should return task unchanged if no status or order change', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
      status: 'in_progress',
      order: 1,
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'user123',
      members: [],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await reorderTasks.execute('task123', 'user123', 'user', {
      newStatus: 'in_progress',
      newOrder: 1,
    });

    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it('should throw ValidationError for invalid status', async () => {
    await expect(
      reorderTasks.execute('task123', 'user123', 'user', {
        newStatus: 'invalid',
        newOrder: 0,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid order', async () => {
    await expect(
      reorderTasks.execute('task123', 'user123', 'user', {
        newStatus: 'in_progress',
        newOrder: -1,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError if task does not exist', async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(
      reorderTasks.execute('nonexistent', 'user123', 'user', {
        newStatus: 'in_progress',
        newOrder: 0,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError if project does not exist', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      reorderTasks.execute('task123', 'user123', 'user', {
        newStatus: 'in_progress',
        newOrder: 0,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user has no access', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'owner456',
      members: [],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      reorderTasks.execute('task123', 'user123', 'user', {
        newStatus: 'in_progress',
        newOrder: 0,
      })
    ).rejects.toThrow(AuthorizationError);
  });

  it('should allow project members to reorder tasks', async () => {
    const userId = 'member123';
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
      status: 'not_started',
      order: 0,
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'owner456',
      members: [userId],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockTaskRepository.update.mockResolvedValue(mockTask);

    await reorderTasks.execute('task123', userId, 'user', {
      newStatus: 'completed',
      newOrder: 3,
    });

    expect(mockTaskRepository.update).toHaveBeenCalled();
  });

  it('should invalidate relevant caches', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
      status: 'not_started',
      order: 0,
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'user123',
      members: [],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockTaskRepository.update.mockResolvedValue(mockTask);

    await reorderTasks.execute('task123', 'user123', 'user', {
      newStatus: 'in_progress',
      newOrder: 1,
    });

    expect(mockCacheService.del).toHaveBeenCalledWith('task:task123');
    expect(mockCacheService.delPattern).toHaveBeenCalledWith('task:project:project123:*');
  });
});
