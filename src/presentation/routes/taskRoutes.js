const express = require('express');

/**
 * Task Routes
 * Defines all task management and Kanban endpoints
 */
const createTaskRoutes = ({ taskController, authMiddleware, roleMiddleware, validationMiddleware }) => {
  const router = express.Router();
  const taskValidators = require('../validators/taskValidators');

  /**
   * @swagger
   * /api/v1/tasks:
   *   post:
   *     tags:
   *       - Tasks
   *     summary: Create a new task
   *     description: Creates a new task in a project. User must be owner or member of the project.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTaskRequest'
   *     responses:
   *       201:
   *         description: Task created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Task created successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.post(
    '/',
    authMiddleware,
    validationMiddleware(taskValidators.createTaskSchema),
    taskController.createTask.bind(taskController)
  );

  /**
   * @swagger
   * /api/v1/tasks/{taskId}:
   *   get:
   *     tags:
   *       - Tasks
   *     summary: Get task by ID
   *     description: Retrieves a single task. Access controlled by project visibility.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID (MongoDB ObjectId)
   *     responses:
   *       200:
   *         description: Task retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.get(
    '/:taskId',
    authMiddleware,
    validationMiddleware(taskValidators.taskIdParamSchema, 'params'),
    taskController.getTask.bind(taskController)
  );

  /**
   * @swagger
   * /api/v1/tasks/{taskId}:
   *   patch:
   *     tags:
   *       - Tasks
   *     summary: Update a task
   *     description: Updates task fields. User must be owner or member of the project.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID (MongoDB ObjectId)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTaskRequest'
   *     responses:
   *       200:
   *         description: Task updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Task updated successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.patch(
    '/:taskId',
    authMiddleware,
    validationMiddleware(taskValidators.taskIdParamSchema, 'params'),
    validationMiddleware(taskValidators.updateTaskSchema),
    taskController.updateTask.bind(taskController)
  );

  /**
   * @swagger
   * /api/v1/tasks/{taskId}:
   *   delete:
   *     tags:
   *       - Tasks
   *     summary: Delete a task
   *     description: Deletes a task. User must be owner or member of the project.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID (MongoDB ObjectId)
   *     responses:
   *       200:
   *         description: Task deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Task deleted successfully
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.delete(
    '/:taskId',
    authMiddleware,
    validationMiddleware(taskValidators.taskIdParamSchema, 'params'),
    taskController.deleteTask.bind(taskController)
  );

  /**
   * @swagger
   * /api/v1/tasks/{taskId}/status:
   *   patch:
   *     tags:
   *       - Tasks
   *     summary: Update task status
   *     description: Moves task between Kanban columns (not_started, in_progress, completed). Automatically places task at end of new column.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID (MongoDB ObjectId)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [not_started, in_progress, completed]
   *                 description: New task status
   *                 example: in_progress
   *     responses:
   *       200:
   *         description: Task status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Task status updated successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.patch(
    '/:taskId/status',
    authMiddleware,
    validationMiddleware(taskValidators.taskIdParamSchema, 'params'),
    validationMiddleware(taskValidators.updateStatusSchema),
    taskController.updateTaskStatus.bind(taskController)
  );

  /**
   * @swagger
   * /api/v1/tasks/{taskId}/priority:
   *   patch:
   *     tags:
   *       - Tasks
   *     summary: Update task priority
   *     description: Changes the priority level of a task (none, low, medium, high).
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID (MongoDB ObjectId)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - priority
   *             properties:
   *               priority:
   *                 type: string
   *                 enum: [none, low, medium, high]
   *                 description: New task priority
   *                 example: high
   *     responses:
   *       200:
   *         description: Task priority updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Task priority updated successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.patch(
    '/:taskId/priority',
    authMiddleware,
    validationMiddleware(taskValidators.taskIdParamSchema, 'params'),
    validationMiddleware(taskValidators.updatePrioritySchema),
    taskController.updateTaskPriority.bind(taskController)
  );

  /**
   * @swagger
   * /api/v1/tasks/{taskId}/reorder:
   *   patch:
   *     tags:
   *       - Tasks
   *     summary: Reorder task (Kanban drag-and-drop)
   *     description: Reorders a task within or across Kanban columns. Automatically adjusts order of other tasks. Supports optimistic UI updates.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID (MongoDB ObjectId)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - newStatus
   *               - newOrder
   *             properties:
   *               newStatus:
   *                 type: string
   *                 enum: [not_started, in_progress, completed]
   *                 description: Target column status
   *                 example: in_progress
   *               newOrder:
   *                 type: integer
   *                 minimum: 0
   *                 description: New position in the column (0-based)
   *                 example: 2
   *     responses:
   *       200:
   *         description: Task reordered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Task reordered successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.patch(
    '/:taskId/reorder',
    authMiddleware,
    validationMiddleware(taskValidators.taskIdParamSchema, 'params'),
    validationMiddleware(taskValidators.reorderTasksSchema),
    taskController.reorderTasks.bind(taskController)
  );

  /**
   * @swagger
   * /api/v1/tasks/{taskId}/assign:
   *   patch:
   *     tags:
   *       - Tasks
   *     summary: Assign task to a user
   *     description: Assigns a task to a project member. User must be an active member of the project.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID (MongoDB ObjectId)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - assigneeId
   *             properties:
   *               assigneeId:
   *                 type: string
   *                 description: User ID to assign the task to (must be project member)
   *                 example: 507f1f77bcf86cd799439011
   *     responses:
   *       200:
   *         description: Task assigned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Task assigned successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.patch(
    '/:taskId/assign',
    authMiddleware,
    validationMiddleware(taskValidators.taskIdParamSchema, 'params'),
    validationMiddleware(taskValidators.assignTaskSchema),
    taskController.assignTask.bind(taskController)
  );

  /**
   * @swagger
   * /api/v1/projects/{projectId}/tasks:
   *   get:
   *     tags:
   *       - Tasks
   *     summary: Get all tasks for a project
   *     description: Retrieves all tasks for a project with optional filtering. Returns tasks grouped by status for Kanban view.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID (MongoDB ObjectId)
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [not_started, in_progress, completed]
   *         description: Filter by task status
   *       - in: query
   *         name: priority
   *         schema:
   *           type: string
   *           enum: [none, low, medium, high]
   *         description: Filter by task priority
   *       - in: query
   *         name: assigneeId
   *         schema:
   *           type: string
   *         description: Filter by assignee user ID
   *     responses:
   *       200:
   *         description: Tasks retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     projectId:
   *                       type: string
   *                       example: 507f1f77bcf86cd799439011
   *                     tasks:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Task'
   *                     groupedByStatus:
   *                       type: object
   *                       properties:
   *                         not_started:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Task'
   *                         in_progress:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Task'
   *                         completed:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/Task'
   *                     total:
   *                       type: integer
   *                       example: 15
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  // This route is actually mounted in project routes to maintain RESTful nesting

  return router;
};

module.exports = createTaskRoutes;
