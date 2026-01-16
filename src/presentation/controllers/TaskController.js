/**
 * Task Controller
 * Handles HTTP requests for task management and Kanban operations
 */
class TaskController {
  constructor({ useCases, logger }) {
    this.createTaskUseCase = useCases.createTask;
    this.getTaskUseCase = useCases.getTask;
    this.getProjectTasksUseCase = useCases.getProjectTasks;
    this.updateTaskUseCase = useCases.updateTask;
    this.updateTaskStatusUseCase = useCases.updateTaskStatus;
    this.updateTaskPriorityUseCase = useCases.updateTaskPriority;
    this.reorderTasksUseCase = useCases.reorderTasks;
    this.assignTaskUseCase = useCases.assignTask;
    this.deleteTaskUseCase = useCases.deleteTask;
    this.logger = logger;
  }

  /**
   * Create a new task
   * POST /api/v1/tasks
   */
  async createTask(req, res, next) {
    try {
      const taskData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const task = await this.createTaskUseCase.execute(
        taskData,
        req.user.id,
        req.user.role
      );

      this.logger.info('Task created successfully', {
        taskId: task.id,
        userId: req.user.id,
        projectId: task.projectId,
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single task by ID
   * GET /api/v1/tasks/:taskId
   */
  async getTask(req, res, next) {
    try {
      const { taskId } = req.params;

      const task = await this.getTaskUseCase.execute(
        taskId,
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tasks for a project
   * GET /api/v1/projects/:projectId/tasks
   */
  async getProjectTasks(req, res, next) {
    try {
      const { projectId } = req.params;
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        assigneeId: req.query.assigneeId,
      };

      const result = await this.getProjectTasksUseCase.execute(
        projectId,
        req.user.id,
        req.user.role,
        filters
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a task
   * PATCH /api/v1/tasks/:taskId
   */
  async updateTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const updates = req.body;

      const task = await this.updateTaskUseCase.execute(
        taskId,
        req.user.id,
        req.user.role,
        updates
      );

      this.logger.info('Task updated successfully', {
        taskId,
        userId: req.user.id,
      });

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update task status (move between Kanban columns)
   * PATCH /api/v1/tasks/:taskId/status
   */
  async updateTaskStatus(req, res, next) {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      const task = await this.updateTaskStatusUseCase.execute(
        taskId,
        req.user.id,
        req.user.role,
        status
      );

      this.logger.info('Task status updated successfully', {
        taskId,
        userId: req.user.id,
        newStatus: status,
      });

      res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update task priority
   * PATCH /api/v1/tasks/:taskId/priority
   */
  async updateTaskPriority(req, res, next) {
    try {
      const { taskId } = req.params;
      const { priority } = req.body;

      const task = await this.updateTaskPriorityUseCase.execute(
        taskId,
        req.user.id,
        req.user.role,
        priority
      );

      this.logger.info('Task priority updated successfully', {
        taskId,
        userId: req.user.id,
        newPriority: priority,
      });

      res.status(200).json({
        success: true,
        message: 'Task priority updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder tasks (Kanban drag-and-drop)
   * PATCH /api/v1/tasks/:taskId/reorder
   */
  async reorderTasks(req, res, next) {
    try {
      const { taskId } = req.params;
      const { newStatus, newOrder } = req.body;

      const task = await this.reorderTasksUseCase.execute(
        taskId,
        req.user.id,
        req.user.role,
        { newStatus, newOrder }
      );

      this.logger.info('Task reordered successfully', {
        taskId,
        userId: req.user.id,
        newStatus,
        newOrder,
      });

      res.status(200).json({
        success: true,
        message: 'Task reordered successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assign task to a user
   * PATCH /api/v1/tasks/:taskId/assign
   */
  async assignTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const { assigneeId } = req.body;

      const task = await this.assignTaskUseCase.execute(
        taskId,
        req.user.id,
        req.user.role,
        assigneeId
      );

      this.logger.info('Task assigned successfully', {
        taskId,
        userId: req.user.id,
        assigneeId,
      });

      res.status(200).json({
        success: true,
        message: 'Task assigned successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a task
   * DELETE /api/v1/tasks/:taskId
   */
  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;

      const result = await this.deleteTaskUseCase.execute(
        taskId,
        req.user.id,
        req.user.role
      );

      this.logger.info('Task deleted successfully', {
        taskId,
        userId: req.user.id,
      });

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
