const DeleteTask = require('../../../../../src/application/use-cases/task/DeleteTask');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('DeleteTask Use Case', () => {
  let deleteTask;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    mockProjectRepository = {
      findById: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    deleteTask = new DeleteTask({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: { del: jest.fn(), delPattern: jest.fn() },
      logger: mockLogger,
    });
  });

  it('should delete task successfully', async () => {
    const taskId = 'task123';
    const userId = 'user123';

    const mockTask = {
      id: taskId,
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: userId,
      members: [],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockTaskRepository.delete.mockResolvedValue();

    const result = await deleteTask.execute(taskId, userId, 'user');

    expect(result).toEqual({ success: true, message: 'Task deleted successfully' });
    expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it('should throw NotFoundError if task does not exist', async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(
      deleteTask.execute('nonexistent', 'user123', 'user')
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
      deleteTask.execute('task123', 'user123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user is not authorized', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'otheruser',
      members: [],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      deleteTask.execute('task123', 'user123', 'user')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should allow project member to delete task', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: ['user123'],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockTaskRepository.delete.mockResolvedValue();

    const result = await deleteTask.execute('task123', 'user123', 'user');

    expect(result).toEqual({ success: true, message: 'Task deleted successfully' });
  });
});
