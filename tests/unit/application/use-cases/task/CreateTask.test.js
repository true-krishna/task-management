/**
 * Unit Tests for CreateTask Use Case
 */
const CreateTask = require('../../../../../src/application/use-cases/task/CreateTask');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');

describe('CreateTask Use Case', () => {
  let createTask;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
      getMaxOrder: jest.fn(),
    };

    mockProjectRepository = {
      findById: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    createTask = new CreateTask({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: { del: jest.fn(), delPattern: jest.fn() },
      logger: mockLogger,
    });
  });

  describe('execute', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        projectId: 'project123',
        priority: 'high',
        status: 'not_started',
      };

      const userId = 'user123';
      const userRole = 'user';

      const mockProject = {
        id: 'project123',
        ownerId: userId,
        members: [],
      };

      const mockTask = {
        id: 'task123',
        ...taskData,
        order: 1,
        createdAt: new Date(),
      };

      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockTaskRepository.getMaxOrder.mockResolvedValue(0);
      mockTaskRepository.create.mockResolvedValue(mockTask);

      const result = await createTask.execute(taskData, userId, userRole);

      expect(result).toEqual(mockTask);
      expect(mockProjectRepository.findById).toHaveBeenCalledWith('project123');
      expect(mockTaskRepository.getMaxOrder).toHaveBeenCalledWith('project123', 'not_started');
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        projectId: taskData.projectId,
        assigneeId: undefined,
        dueDate: undefined,
        order: 1,
        createdBy: userId,
        modifiedBy: userId,
      });
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should throw NotFoundError if project does not exist', async () => {
      const taskData = {
        title: 'Test Task',
        projectId: 'nonexistent',
      };

      mockProjectRepository.findById.mockResolvedValue(null);

      await expect(
        createTask.execute(taskData, 'user123', 'user')
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError if user is not owner or member', async () => {
      const taskData = {
        title: 'Test Task',
        projectId: 'project123',
      };

      const mockProject = {
        id: 'project123',
        ownerId: 'otheruser',
        members: [],
      };

      mockProjectRepository.findById.mockResolvedValue(mockProject);

      await expect(
        createTask.execute(taskData, 'user123', 'user')
      ).rejects.toThrow(AuthorizationError);
    });

    it('should allow member to create task', async () => {
      const taskData = {
        title: 'Member Task',
        projectId: 'project123',
      };

      const mockProject = {
        id: 'project123',
        ownerId: 'owner123',
        members: ['user123'],
      };

      const mockTask = { id: 'task123', ...taskData, order: 1 };

      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockTaskRepository.getMaxOrder.mockResolvedValue(0);
      mockTaskRepository.create.mockResolvedValue(mockTask);

      const result = await createTask.execute(taskData, 'user123', 'user');

      expect(result).toEqual(mockTask);
    });

    it('should set correct order based on existing tasks', async () => {
      const taskData = {
        title: 'New Task',
        projectId: 'project123',
        status: 'not_started',
      };

      const mockProject = {
        id: 'project123',
        ownerId: 'user123',
        members: [],
      };

      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockTaskRepository.getMaxOrder.mockResolvedValue(5);
      mockTaskRepository.create.mockResolvedValue({ id: 'task123', ...taskData, order: 6 });

      await createTask.execute(taskData, 'user123', 'user');

      expect(mockTaskRepository.getMaxOrder).toHaveBeenCalledWith('project123', 'not_started');
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: taskData.title,
        description: undefined,
        status: taskData.status,
        priority: undefined,
        projectId: taskData.projectId,
        assigneeId: undefined,
        dueDate: undefined,
        order: 6,
        createdBy: 'user123',
        modifiedBy: 'user123',
      });
    });

    it('should throw ValidationError for invalid data', async () => {
      const taskData = {
        // missing title
        projectId: 'project123',
      };

      await expect(
        createTask.execute(taskData, 'user123', 'user')
      ).rejects.toThrow(ValidationError);
    });
  });
});
