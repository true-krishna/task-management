/**
 * Unit Tests for UpdateTask Use Case
 */
const UpdateTask = require('../../../../../src/application/use-cases/task/UpdateTask');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('UpdateTask Use Case', () => {
  let updateTask;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockProjectRepository = {
      findById: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    updateTask = new UpdateTask({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: { del: jest.fn(), delPattern: jest.fn() },
      logger: mockLogger,
    });
  });

  it('should update task successfully', async () => {
    const taskId = 'task123';
    const updates = {
      title: 'Updated Title',
      priority: 'high',
    };
    const userId = 'user123';

    const mockTask = {
      id: taskId,
      title: 'Old Title',
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
      ...updates,
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockTaskRepository.update.mockResolvedValue(mockUpdatedTask);

    const result = await updateTask.execute(taskId, userId, 'user', updates);

    expect(result).toEqual(mockUpdatedTask);
    expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, {
      ...updates,
      modifiedBy: userId,
    });
  });

  it('should throw NotFoundError if task does not exist', async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(
      updateTask.execute('nonexistent', { title: 'Updated' }, 'user123', 'user')
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
      updateTask.execute('task123', 'user123', 'user', { title: 'Updated' })
    ).rejects.toThrow(AuthorizationError);
  });

  it('should allow project member to update task', async () => {
    const mockTask = {
      id: 'task123',
      projectId: 'project123',
    };

    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: ['user123'],
    };

    const mockUpdatedTask = {
      ...mockTask,
      title: 'Updated',
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockTaskRepository.update.mockResolvedValue(mockUpdatedTask);

    const result = await updateTask.execute('task123', 'user123', 'user', { title: 'Updated' });

    expect(result).toEqual(mockUpdatedTask);
  });
});
