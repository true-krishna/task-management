/**
 * Unit Tests for Task Entity
 */
const Task = require('../../../../src/domain/entities/Task');

describe('Task Entity', () => {
  describe('Constructor', () => {
    it('should create a task with all properties', () => {
      const taskData = {
        id: '507f1f77bcf86cd799439011',
        title: 'Test Task',
        description: 'Test Description',
        projectId: '507f1f77bcf86cd799439012',
        assigneeId: '507f1f77bcf86cd799439013',
        status: 'in_progress',
        priority: 'high',
        order: 5,
        dueDate: new Date(),
      };

      const task = new Task(taskData);

      expect(task.id).toBe(taskData.id);
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.projectId).toBe(taskData.projectId);
      expect(task.assigneeId).toBe(taskData.assigneeId);
      expect(task.status).toBe('in_progress');
      expect(task.priority).toBe('high');
      expect(task.order).toBe(5);
    });

    it('should use default values', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
      });

      expect(task.description).toBe('');
      expect(task.assigneeId).toBeNull();
      expect(task.status).toBe('not_started');
      expect(task.priority).toBe('none');
      expect(task.order).toBe(0);
      expect(task.dueDate).toBeNull();
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

  describe('isCompleted', () => {
    it('should return true if task status is completed', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: 'completed',
      });

      expect(task.isCompleted()).toBe(true);
    });

    it('should return false if task status is not_started', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: 'not_started',
      });

      expect(task.isCompleted()).toBe(false);
    });

    it('should return false if task status is in_progress', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: 'in_progress',
      });

      expect(task.isCompleted()).toBe(false);
    });
  });

  describe('isInProgress', () => {
    it('should return true if task status is in_progress', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: 'in_progress',
      });

      expect(task.isInProgress()).toBe(true);
    });

    it('should return false otherwise', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        status: 'completed',
      });

      expect(task.isInProgress()).toBe(false);
    });
  });

  describe('isHighPriority', () => {
    it('should return true if priority is high', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        priority: 'high',
      });

      expect(task.isHighPriority()).toBe(true);
    });

    it('should return false if priority is not high', () => {
      const task = new Task({
        title: 'Test Task',
        projectId: '507f1f77bcf86cd799439012',
        priority: 'medium',
      });

      expect(task.isHighPriority()).toBe(false);
    });
  });
});
