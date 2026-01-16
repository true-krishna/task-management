/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Task unique identifier
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           description: Task title
 *           example: Implement user authentication
 *         description:
 *           type: string
 *           description: Detailed task description
 *           example: Create login and registration endpoints with JWT
 *         projectId:
 *           type: string
 *           description: Project ID this task belongs to
 *           example: 507f1f77bcf86cd799439012
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, completed]
 *           description: Current task status (Kanban column)
 *           example: in_progress
 *         priority:
 *           type: string
 *           enum: [none, low, medium, high]
 *           description: Task priority level
 *           example: high
 *         assigneeId:
 *           type: string
 *           description: User ID assigned to this task
 *           example: 507f1f77bcf86cd799439013
 *         order:
 *           type: integer
 *           description: Order within the status column for Kanban
 *           example: 2
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Task due date
 *           example: 2024-12-31T23:59:59.000Z
 *         createdBy:
 *           type: string
 *           description: User ID who created the task
 *           example: 507f1f77bcf86cd799439014
 *         modifiedBy:
 *           type: string
 *           description: User ID who last modified the task
 *           example: 507f1f77bcf86cd799439014
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Task creation timestamp
 *           example: 2024-01-15T10:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Task last update timestamp
 *           example: 2024-01-16T14:20:00.000Z
 *
 *     CreateTaskRequest:
 *       type: object
 *       required:
 *         - title
 *         - projectId
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Task title
 *           example: Implement user authentication
 *         description:
 *           type: string
 *           maxLength: 2000
 *           description: Detailed task description
 *           example: Create login and registration endpoints with JWT authentication
 *         projectId:
 *           type: string
 *           description: Project ID (must be owner or member)
 *           example: 507f1f77bcf86cd799439012
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, completed]
 *           default: not_started
 *           description: Initial task status
 *           example: not_started
 *         priority:
 *           type: string
 *           enum: [none, low, medium, high]
 *           default: none
 *           description: Task priority
 *           example: high
 *         assigneeId:
 *           type: string
 *           description: User ID to assign (must be project member)
 *           example: 507f1f77bcf86cd799439013
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Task due date (ISO 8601)
 *           example: 2024-12-31T23:59:59.000Z
 *
 *     UpdateTaskRequest:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Task title
 *           example: Update user authentication
 *         description:
 *           type: string
 *           maxLength: 2000
 *           description: Task description
 *           example: Add OAuth2 support to authentication
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, completed]
 *           description: Task status
 *           example: in_progress
 *         priority:
 *           type: string
 *           enum: [none, low, medium, high]
 *           description: Task priority
 *           example: medium
 *         assigneeId:
 *           type: string
 *           nullable: true
 *           description: User ID to assign (null to unassign)
 *           example: 507f1f77bcf86cd799439013
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Task due date (null to remove)
 *           example: 2024-12-31T23:59:59.000Z
 */

module.exports = {};
