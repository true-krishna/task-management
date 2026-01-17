const TaskController = require('../../../../src/presentation/controllers/TaskController');

describe('TaskController', () => {
  let taskController;
  let useCases;
  let mockLogger;
  let req, res, next;

  beforeEach(() => {
    useCases = {
      createTask: { execute: jest.fn() },
      getTask: { execute: jest.fn() },
      getProjectTasks: { execute: jest.fn() },
      updateTask: { execute: jest.fn() },
      updateTaskStatus: { execute: jest.fn() },
      updateTaskPriority: { execute: jest.fn() },
      reorderTasks: { execute: jest.fn() },
      assignTask: { execute: jest.fn() },
      deleteTask: { execute: jest.fn() },
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    taskController = new TaskController({
      useCases,
      logger: mockLogger,
    });

    req = {
      user: { id: 'user123', role: 'user' },
      params: {},
      query: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      req.body = {
        title: 'New Task',
        projectId: 'project123',
        description: 'Task description',
      };

      const mockTask = {
        id: 'task123',
        title: 'New Task',
        projectId: 'project123',
      };

      useCases.createTask.execute.mockResolvedValue(mockTask);

      await taskController.createTask(req, res, next);

      expect(useCases.createTask.execute).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task created successfully',
        data: mockTask,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Creation failed');
      useCases.createTask.execute.mockRejectedValue(error);

      await taskController.createTask(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getTask', () => {
    it('should get task successfully', async () => {
      req.params.taskId = 'task123';
      const mockTask = { id: 'task123', title: 'Task' };

      useCases.getTask.execute.mockResolvedValue(mockTask);

      await taskController.getTask(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTask,
      });
    });

    it('should handle errors', async () => {
      req.params.taskId = 'task123';
      const error = new Error('Not found');
      useCases.getTask.execute.mockRejectedValue(error);

      await taskController.getTask(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      req.params.taskId = 'task123';
      req.body = { title: 'Updated Task' };

      const mockTask = { id: 'task123', title: 'Updated Task' };
      useCases.updateTask.execute.mockResolvedValue(mockTask);

      await taskController.updateTask(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task updated successfully',
        data: mockTask,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      req.params.taskId = 'task123';

      useCases.deleteTask.execute.mockResolvedValue(true);

      await taskController.deleteTask(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task deleted successfully',
      });
    });
  });
});
