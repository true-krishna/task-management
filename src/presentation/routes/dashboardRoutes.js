const express = require('express');

/**
 * Dashboard routes factory
 */
function createDashboardRoutes({ dashboardController, authMiddleware }) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Dashboard
   *   description: Dashboard and analytics endpoints
   */

  /**
   * @swagger
   * /api/v1/dashboard/stats:
   *   get:
   *     summary: Get comprehensive dashboard statistics
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard statistics retrieved successfully
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
   *                     totalProjects:
   *                       type: integer
   *                       example: 5
   *                     totalTasks:
   *                       type: integer
   *                       example: 42
   *                     tasksByStatus:
   *                       type: object
   *                       properties:
   *                         not_started:
   *                           type: integer
   *                           example: 10
   *                         in_progress:
   *                           type: integer
   *                           example: 15
   *                         completed:
   *                           type: integer
   *                           example: 17
   *                     tasksByPriority:
   *                       type: object
   *                       properties:
   *                         none:
   *                           type: integer
   *                           example: 5
   *                         low:
   *                           type: integer
   *                           example: 10
   *                         medium:
   *                           type: integer
   *                           example: 20
   *                         high:
   *                           type: integer
   *                           example: 7
   *                     projectsByStatus:
   *                       type: object
   *                       properties:
   *                         planning:
   *                           type: integer
   *                           example: 1
   *                         active:
   *                           type: integer
   *                           example: 3
   *                         completed:
   *                           type: integer
   *                           example: 1
   *                         archived:
   *                           type: integer
   *                           example: 0
   *                     completionRate:
   *                       type: number
   *                       example: 40.48
   *                     myTasks:
   *                       type: integer
   *                       example: 12
   *                     overdueTasks:
   *                       type: integer
   *                       example: 3
   *                     recentActivity:
   *                       type: object
   *                       properties:
   *                         tasksCreatedThisWeek:
   *                           type: integer
   *                           example: 8
   *                         tasksCompletedThisWeek:
   *                           type: integer
   *                           example: 5
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/stats', authMiddleware, (req, res, next) =>
    dashboardController.getDashboardStats(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/dashboard/task-distribution:
   *   get:
   *     summary: Get task distribution by status
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Task distribution retrieved successfully
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
   *                     byStatus:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           status:
   *                             type: string
   *                             enum: [not_started, in_progress, completed]
   *                             example: in_progress
   *                           count:
   *                             type: integer
   *                             example: 15
   *                           percentage:
   *                             type: integer
   *                             example: 36
   *                     total:
   *                       type: integer
   *                       example: 42
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/task-distribution', authMiddleware, (req, res, next) =>
    dashboardController.getTaskDistribution(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/dashboard/priority-distribution:
   *   get:
   *     summary: Get task distribution by priority
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Priority distribution retrieved successfully
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
   *                     byPriority:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           priority:
   *                             type: string
   *                             enum: [none, low, medium, high]
   *                             example: high
   *                           count:
   *                             type: integer
   *                             example: 7
   *                           percentage:
   *                             type: integer
   *                             example: 17
   *                     total:
   *                       type: integer
   *                       example: 42
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/priority-distribution', authMiddleware, (req, res, next) =>
    dashboardController.getPriorityDistribution(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/dashboard/weekly-trend:
   *   get:
   *     summary: Get weekly task completion trend
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Weekly trend retrieved successfully
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
   *                     daily:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           date:
   *                             type: string
   *                             format: date
   *                             example: 2024-01-15
   *                           created:
   *                             type: integer
   *                             example: 3
   *                           completed:
   *                             type: integer
   *                             example: 2
   *                     summary:
   *                       type: object
   *                       properties:
   *                         totalCreated:
   *                           type: integer
   *                           example: 21
   *                         totalCompleted:
   *                           type: integer
   *                           example: 14
   *                         averageCreatedPerDay:
   *                           type: integer
   *                           example: 3
   *                         averageCompletedPerDay:
   *                           type: integer
   *                           example: 2
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/weekly-trend', authMiddleware, (req, res, next) =>
    dashboardController.getWeeklyTrend(req, res, next)
  );

  return router;
}

module.exports = createDashboardRoutes;
