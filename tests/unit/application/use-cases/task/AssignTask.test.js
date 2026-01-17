const AssignTask = require('../../../../../src/application/use-cases/task/AssignTask');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('AssignTask Use Case', () => {
  let assignTask;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockUserRepository;
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

    mockUserRepository = {
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

    assignTask = new AssignTask({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      userRepository: mockUserRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should assign task successfully', async () => {
    const taskId = 'task123';
    const userId = 'user123';
    const assigneeId = 'assignee123';

    const mockTask = {
      id: taskId,
      projectId: 'project123',
      assigneeId: null,
    };

    const mockProject = {
      id: 'project123',
      ownerId: userId,
      members: [assigneeId],
    };

    const mockAssignee = {
      id: assigneeId,
      email: 'assignee@test.com',
      isActive: true,
    };

    const mockUpdatedTask = {
      ...mockTask,
      assigneeId,
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue(mockAssignee);
    mockTaskRepository.update.mockResolvedValue(mockUpdatedTask);

    const result = await assignTask.execute(taskId, userId, 'user', assigneeId);

    expect(result.assigneeId).toBe(assigneeId);
    expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, {
      assigneeId,
      modifiedBy: userId,
    });
  });

  it('should throw ValidationError if assigneeId is missing', async () => {
    await expect(
      assignTask.execute('task123', 'user123', 'user', null)
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError if task does not exist', async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(
      assignTask.execute('nonexistent', 'user123', 'user', 'assignee123')
    ).rejects.toThrow(NotFoundError);
  });

  it('should return task unchanged if already assigned to user', async () => {
    const assigneeId = 'assignee123';
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
      assigneeId,
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);

    const result = await assignTask.execute('task123', 'user123', 'user', assigneeId);

    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError if assignee does not exist', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'user123',
      members: [],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      assignTask.execute('task123', 'user123', 'user', 'nonexistent')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError if assignee is inactive', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'user123',
      members: [],
    };

    const mockAssignee = {
      id: 'assignee123',
      isActive: false,
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue(mockAssignee);

    await expect(
      assignTask.execute('task123', 'user123', 'user', 'assignee123')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError if assignee is not a project member', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: [],
    };

    const mockAssignee = {
      id: 'assignee123',
      isActive: true,
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue(mockAssignee);

    await expect(
      assignTask.execute('task123', 'owner123', 'user', 'assignee123')
    ).rejects.toThrow(ValidationError);
  });
});
