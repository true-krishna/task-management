/**
 * Unit Tests for Task Entity
 */
const Task = require('../../../../src/domain/entities/Task');
const TaskStatus = require('../../../../src/domain/enums/TaskStatus');
const TaskPriority = require('../../../../src/domain/enums/TaskPriority');
const ValidationError = require('../../../../src/domain/errors/ValidationError');

describe('Task Entity', () => {
  describe('Constructor', () => {
    it('should create a task with valid data', () => {
      const taskData = {
        id: '507f1f77bcf86cd799439011',
        title: 'Test Task',
        description: 'Test Description',
        projectId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const task = new Task(taskData);

      expect(task.id).toBe(taskData.id);
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.projectId).toBe(taskData.projectId);
      expect(task.assigneeId).toBe(taskData.assigneeId);
      expect(task.status).toBe(TaskStatus.IN_PROGRESS);
      expect(task.priority).toBe(TaskPriority.HIGH);
    });

    it('should throw ValidationError for missing title', () => {
      const taskData = {
        projectId: '507f1f77bcf86cd799439012',
      };

      expect(() => new Task(taskData)).toThrow(ValidationError);
      expect(() => new Task(taskData)).toThrow('Task title is required');
    });

    it('should throw ValidationError for missing projectId', () => {
      const taskData = {
        title: 'Test Task',
      };

      expect(() => new Task(taskData)).toThrow(ValidationError);
      expect(() => new Task(taskData)).toThrow('Project ID is required');
    });

    it('should throw ValidationError for invalid status', () => {
      const taskData = {
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: 'invalid_status',
      };

      expect(() => new Task(taskData)).toThrow(ValidationError);
      expect(() => new Task(taskData)).toThrow('Invalid task status');
    });

    it('should throw ValidationError for invalid priority', () => {
      const taskData = {
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        priority: 'invalid_priority',
      };

      expect(() => new Task(taskData)).toThrow(ValidationError);
      expect(() => new Task(taskData)).toThrow('Invalid task priority');
    });

    it('should default status to TODO if not provided', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
      });

      expect(task.status).toBe(TaskStatus.TODO);
    });

    it('should default priority to MEDIUM if not provided', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
      });

      expect(task.priority).toBe(TaskPriority.MEDIUM);
    });
  });

  describe('isAssigned', () => {
    it('should return true if task has an assignee', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
      });

      expect(task.isAssigned()).toBe(true);
    });

    it('should return false if task has no assignee', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
      });

      expect(task.isAssigned()).toBe(false);
    });
  });

  describe('isAssignedTo', () => {
    it('should return true if task is assigned to the given user', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
      });

      expect(task.isAssignedTo('507f1f77bcf86cd799439013')).toBe(true);
    });

    it('should return false if task is assigned to a different user', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
      });

      expect(task.isAssignedTo('507f1f77bcf86cd799439099')).toBe(false);
    });

    it('should return false if task has no assignee', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
      });

      expect(task.isAssignedTo('507f1f77bcf86cd799439013')).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('should return true if task status is DONE', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: TaskStatus.DONE,
      });

      expect(task.isCompleted()).toBe(true);
    });

    it('should return false if task status is TODO', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: TaskStatus.TODO,
      });

      expect(task.isCompleted()).toBe(false);
    });

    it('should return false if task status is IN_PROGRESS', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: TaskStatus.IN_PROGRESS,
      });

      expect(task.isCompleted()).toBe(false);
    });
  });

  describe('isOverdue', () => {
    it('should return true if task is past due date and not completed', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: TaskStatus.IN_PROGRESS,
        dueDate: pastDate,
      });

      expect(task.isOverdue()).toBe(true);
    });

    it('should return false if task is past due date but completed', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: TaskStatus.DONE,
        dueDate: pastDate,
      });

      expect(task.isOverdue()).toBe(false);
    });

    it('should return false if task has future due date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: TaskStatus.IN_PROGRESS,
        dueDate: futureDate,
      });

      expect(task.isOverdue()).toBe(false);
    });

    it('should return false if task has no due date', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: TaskStatus.IN_PROGRESS,
      });

      expect(task.isOverdue()).toBe(false);
    });
  });

  describe('assign', () => {
    it('should assign task to a user', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
      });

      task.assign('507f1f77bcf86cd799439013');

      expect(task.assigneeId).toBe('507f1f77bcf86cd799439013');
    });

    it('should update assigneeId if task already has an assignee', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
      });

      task.assign('507f1f77bcf86cd799439020');

      expect(task.assigneeId).toBe('507f1f77bcf86cd799439020');
    });
  });

  describe('unassign', () => {
    it('should remove assignee from task', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
      });

      task.unassign();

      expect(task.assigneeId).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update task status', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: TaskStatus.TODO,
      });

      task.updateStatus(TaskStatus.IN_PROGRESS);

      expect(task.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should throw ValidationError for invalid status', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
      });

      expect(() => task.updateStatus('invalid_status')).toThrow(ValidationError);
    });
  });

  describe('updatePriority', () => {
    it('should update task priority', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        priority: TaskPriority.LOW,
      });

      task.updatePriority(TaskPriority.HIGH);

      expect(task.priority).toBe(TaskPriority.HIGH);
    });

    it('should throw ValidationError for invalid priority', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
      });

      expect(() => task.updatePriority('invalid_priority')).toThrow(ValidationError);
    });
  });
});
