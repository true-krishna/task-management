const express = require('express');

/**
 * User Routes
 * Defines user management endpoints with Swagger documentation
 * 
 * @param {Object} dependencies
 * @param {Object} dependencies.userController - User controller instance
 * @param {Function} dependencies.authMiddleware - Authentication middleware
 * @param {Function} dependencies.roleMiddleware - Role-based authorization middleware
 * @param {Function} dependencies.validationMiddleware - Request validation middleware
 * @returns {express.Router}
 */
function createUserRoutes({ userController, authMiddleware, roleMiddleware, validationMiddleware }) {
  const router = express.Router();
  const {
    updateProfileSchema,
    updateRoleSchema,
    userIdParamSchema,
    getAllUsersQuerySchema,
  } = require('../validators/userValidators');

  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: User management endpoints
   */

  /**
   * @swagger
   * /api/v1/users/profile:
   *   get:
   *     summary: Get current user profile
   *     description: Retrieves the authenticated user's profile information
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/UserProfile'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get(
    '/profile',
    authMiddleware,
    userController.getProfile
  );

  /**
   * @swagger
   * /api/v1/users/profile:
   *   put:
   *     summary: Update current user profile
   *     description: Updates the authenticated user's profile information
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 50
   *                 example: John
   *               lastName:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 50
   *                 example: Doe
   *               avatar:
   *                 type: string
   *                 format: uri
   *                 example: https://example.com/avatar.jpg
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/UserProfile'
   *                 message:
   *                   type: string
   *                   example: Profile updated successfully
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.put(
    '/profile',
    authMiddleware,
    validationMiddleware(updateProfileSchema),
    userController.updateProfile
  );

  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     summary: Get all users (Admin only)
   *     description: Retrieves a paginated list of all users. Only accessible by administrators.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 50
   *         description: Number of items per page
   *       - in: query
   *         name: role
   *         schema:
   *           type: string
   *           enum: [user, admin]
   *         description: Filter by user role
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *         description: Filter by active status
   *     responses:
   *       200:
   *         description: Users retrieved successfully
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
   *                     $ref: '#/components/schemas/UserProfile'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 50
   *                     total:
   *                       type: integer
   *                       example: 100
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get(
    '/',
    authMiddleware,
    roleMiddleware(['admin']),
    validationMiddleware(getAllUsersQuerySchema, 'query'),
    userController.listUsers
  );

  /**
   * @swagger
   * /api/v1/users/{id}/role:
   *   put:
   *     summary: Update user role (Admin only)
   *     description: Changes a user's role. Only accessible by administrators. Admins cannot change their own role.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - role
   *             properties:
   *               role:
   *                 type: string
   *                 enum: [user, admin]
   *                 example: admin
   *     responses:
   *       200:
   *         description: User role updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/UserProfile'
   *                 message:
   *                   type: string
   *                   example: User role updated successfully
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.put(
    '/:id/role',
    authMiddleware,
    roleMiddleware(['admin']),
    validationMiddleware(userIdParamSchema, 'params'),
    validationMiddleware(updateRoleSchema),
    userController.changeUserRole
  );

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   delete:
   *     summary: Deactivate user (Admin only)
   *     description: Soft deletes a user by setting isActive to false. Only accessible by administrators. Admins cannot deactivate their own account.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deactivated successfully
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
   *                   example: User deactivated successfully
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     email:
   *                       type: string
   *                     isActive:
   *                       type: boolean
   *                       example: false
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['admin']),
    validationMiddleware(userIdParamSchema, 'params'),
    userController.deactivateUserAccount
  );

  return router;
}

module.exports = createUserRoutes;
