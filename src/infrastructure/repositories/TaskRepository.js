/**
 * Task Repository Implementation
 * Handles data access for Task entities
 */
const ITaskRepository = require('../../domain/interfaces/repositories/ITaskRepository');
const Task = require('../../domain/entities/Task');
const TaskModel = require('../database/mongoose/models/TaskModel');

class TaskRepository extends ITaskRepository {
  constructor(logger) {
    super();
    this.logger = logger;
  }

  /**
   * Create a new task
   */
  async create(taskData) {
    try {
      const task = new TaskModel(taskData);
      const savedTask = await task.save();
      return this._mapToEntity(savedTask);
    } catch (error) {
      this.logger.error('Error creating task', { error: error.message });
      throw error;
    }
  }

  /**
   * Find task by ID
   */
  async findById(id) {
    try {
      const task = await TaskModel.findById(id);
      return task ? this._mapToEntity(task) : null;
    } catch (error) {
      this.logger.error('Error finding task by ID', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Find all tasks with filters
   */
  async findAll(filter = {}, options = {}) {
    try {
      const { page = 1, limit = 100, sort = { order: 1 } } = options;
      const skip = (page - 1) * limit;

      const tasks = await TaskModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      return tasks.map(task => this._mapToEntity(task));
    } catch (error) {
      this.logger.error('Error finding tasks', { error: error.message });
      throw error;
    }
  }

  /**
   * Find tasks by project ID
   */
  async findByProjectId(projectId, options = {}) {
    try {
      return await this.findAll({ projectId }, options);
    } catch (error) {
      this.logger.error('Error finding tasks by project', { error: error.message, projectId });
      throw error;
    }
  }

  /**
   * Find tasks by status within a project
   */
  async findByProjectAndStatus(projectId, status, options = {}) {
    try {
      const defaultSort = { order: 1, createdAt: -1 };
      const opts = { ...options, sort: options.sort || defaultSort };
      return await this.findAll({ projectId, status }, opts);
    } catch (error) {
      this.logger.error('Error finding tasks by project and status', {
        error: error.message,
        projectId,
        status,
      });
      throw error;
    }
  }

  /**
   * Find tasks by assignee ID
   */
  async findByAssigneeId(assigneeId, options = {}) {
    try {
      return await this.findAll({ assigneeId }, options);
    } catch (error) {
      this.logger.error('Error finding tasks by assignee', { error: error.message, assigneeId });
      throw error;
    }
  }

  /**
   * Update a task
   */
  async update(id, updateData) {
    try {
      const task = await TaskModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return task ? this._mapToEntity(task) : null;
    } catch (error) {
      this.logger.error('Error updating task', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async delete(id) {
    try {
      const result = await TaskModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      this.logger.error('Error deleting task', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Reorder tasks - update multiple tasks' order values
   */
  async reorderTasks(updates) {
    try {
      const bulkOps = updates.map(({ id, order }) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order, updatedAt: new Date() } },
        },
      }));

      await TaskModel.bulkWrite(bulkOps);
      
      // Fetch and return updated tasks
      const taskIds = updates.map(u => u.id);
      const tasks = await TaskModel.find({ _id: { $in: taskIds } }).lean();
      return tasks.map(task => this._mapToEntity(task));
    } catch (error) {
      this.logger.error('Error reordering tasks', { error: error.message });
      throw error;
    }
  }

  /**
   * Get max order value for a project and status
   */
  async getMaxOrder(projectId, status) {
    try {
      const result = await TaskModel.findOne({ projectId, status })
        .sort({ order: -1 })
        .select('order')
        .lean();
      
      return result ? result.order : -1;
    } catch (error) {
      this.logger.error('Error getting max order', { error: error.message, projectId, status });
      throw error;
    }
  }

  /**
   * Count tasks by filter
   */
  async count(filter = {}) {
    try {
      return await TaskModel.countDocuments(filter);
    } catch (error) {
      this.logger.error('Error counting tasks', { error: error.message });
      throw error;
    }
  }

  /**
   * Get task statistics for a project
   */
  async getProjectStatistics(projectId) {
    try {
      const stats = await TaskModel.aggregate([
        { $match: { projectId: projectId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      return stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});
    } catch (error) {
      this.logger.error('Error getting project statistics', { error: error.message, projectId });
      throw error;
    }
  }

  /**
   * Map Mongoose model to domain entity
   */
  _mapToEntity(taskModel) {
    if (!taskModel) return null;

    const taskData = taskModel.toJSON ? taskModel.toJSON() : taskModel;

    return new Task({
      id: taskData.id || taskData._id?.toString(),
      title: taskData.title,
      description: taskData.description,
      projectId: taskData.projectId?.toString(),
      assigneeId: taskData.assigneeId?.toString() || null,
      status: taskData.status,
      priority: taskData.priority,
      order: taskData.order,
      dueDate: taskData.dueDate,
      createdAt: taskData.createdAt,
      updatedAt: taskData.updatedAt,
      createdBy: taskData.createdBy?.toString(),
      modifiedBy: taskData.modifiedBy?.toString() || null,
    });
  }
}

module.exports = TaskRepository;
