const express = require('express');

/**
 * Audit Log Routes
 * Defines all audit trail and activity log endpoints
 */
const createAuditLogRoutes = ({ auditLogController, authMiddleware, roleMiddleware }) => {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Audit
   *   description: Audit trail and activity log endpoints
   */

  /**
   * @swagger
   * /api/v1/audit/statistics:
   *   get:
   *     summary: Get activity statistics (Admin only)
   *     tags: [Audit]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Start date for filtering
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: End date for filtering
   *     responses:
   *       200:
   *         description: Activity statistics retrieved successfully
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
   *                     totalLogs:
   *                       type: integer
   *                       example: 1523
   *                     byAction:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           action:
   *                             type: string
   *                             example: create
   *                           count:
   *                             type: integer
   *                             example: 456
   *                           percentage:
   *                             type: integer
   *                             example: 30
   *                     dateRange:
   *                       type: object
   *                       properties:
   *                         startDate:
   *                           type: string
   *                           format: date-time
   *                           nullable: true
   *                         endDate:
   *                           type: string
   *                           format: date-time
   *                           nullable: true
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/statistics', authMiddleware, roleMiddleware(['admin']), (req, res, next) =>
    auditLogController.getActivityStatistics(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/audit:
   *   get:
   *     summary: Get all activity logs (Admin only)
   *     tags: [Audit]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Number of logs to return
   *       - in: query
   *         name: skip
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Number of logs to skip
   *       - in: query
   *         name: entityType
   *         schema:
   *           type: string
   *           enum: [user, project, task]
   *         description: Filter by entity type
   *       - in: query
   *         name: action
   *         schema:
   *           type: string
   *           enum: [create, update, delete, assign, unassign, status_change, priority_change]
   *         description: Filter by action
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Start date for filtering
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: End date for filtering
   *     responses:
   *       200:
   *         description: Activity logs retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/AuditLog'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/', authMiddleware, roleMiddleware(['admin']), (req, res, next) =>
    auditLogController.getAllActivity(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/audit/user/{userId}:
   *   get:
   *     summary: Get activity logs for a specific user
   *     tags: [Audit]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *         description: Number of logs to return
   *       - in: query
   *         name: skip
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Number of logs to skip
   *       - in: query
   *         name: entityType
   *         schema:
   *           type: string
   *           enum: [user, project, task]
   *         description: Filter by entity type
   *     responses:
   *       200:
   *         description: User activity logs retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/AuditLog'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/user/:userId', authMiddleware, (req, res, next) =>
    auditLogController.getUserActivity(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/audit/{entityType}/{entityId}:
   *   get:
   *     summary: Get activity logs for a specific entity
   *     tags: [Audit]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: entityType
   *         required: true
   *         schema:
   *           type: string
   *           enum: [project, task]
   *         description: Entity type
   *       - in: path
   *         name: entityId
   *         required: true
   *         schema:
   *           type: string
   *         description: Entity ID
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *         description: Number of logs to return
   *       - in: query
   *         name: skip
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Number of logs to skip
   *     responses:
   *       200:
   *         description: Entity activity logs retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/AuditLog'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/:entityType/:entityId', authMiddleware, (req, res, next) =>
    auditLogController.getEntityActivity(req, res, next)
  );

  return router;
};

module.exports = createAuditLogRoutes;
