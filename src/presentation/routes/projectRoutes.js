const express = require('express');

/**
 * Project management routes
 */
const createProjectRoutes = ({
  projectController,
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  projectValidators,
}) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/projects:
   *   post:
   *     tags: [Projects]
   *     summary: Create a new project
   *     description: Create a new project. User becomes the owner.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProjectRequest'
   *     responses:
   *       201:
   *         description: Project created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  router.post(
    '/',
    authMiddleware,
    validationMiddleware(projectValidators.createProjectSchema),
    projectController.create.bind(projectController)
  );

  /**
   * @swagger
   * /api/v1/projects:
   *   get:
   *     tags: [Projects]
   *     summary: Get all accessible projects
   *     description: Get all projects the user has access to (owned, member, or public). Admins see all.
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
   *           default: 10
   *         description: Items per page
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [planning, active, on-hold, completed, archived]
   *         description: Filter by status
   *       - in: query
   *         name: visibility
   *         schema:
   *           type: string
   *           enum: [private, team, public]
   *         description: Filter by visibility
   *     responses:
   *       200:
   *         description: Projects retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectListResponse'
   *       401:
   *         description: Unauthorized
   */
  router.get(
    '/',
    authMiddleware,
    validationMiddleware(projectValidators.getAllProjectsQuerySchema, 'query'),
    projectController.getAll.bind(projectController)
  );

  /**
   * @swagger
   * /api/v1/projects/{projectId}:
   *   get:
   *     tags: [Projects]
   *     summary: Get a single project
   *     description: Get project details if user has access
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     responses:
   *       200:
   *         description: Project retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectDataResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - No access to this project
   *       404:
   *         description: Project not found
   */
  router.get(
    '/:projectId',
    authMiddleware,
    validationMiddleware(projectValidators.projectIdParamSchema, 'params'),
    projectController.getById.bind(projectController)
  );

  /**
   * @swagger
   * /api/v1/projects/{projectId}:
   *   put:
   *     tags: [Projects]
   *     summary: Update a project
   *     description: Update project details (owner or admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateProjectRequest'
   *     responses:
   *       200:
   *         description: Project updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Only owner or admin can update
   *       404:
   *         description: Project not found
   */
  router.put(
    '/:projectId',
    authMiddleware,
    validationMiddleware(projectValidators.projectIdParamSchema, 'params'),
    validationMiddleware(projectValidators.updateProjectSchema),
    projectController.update.bind(projectController)
  );

  /**
   * @swagger
   * /api/v1/projects/{projectId}:
   *   delete:
   *     tags: [Projects]
   *     summary: Delete a project
   *     description: Delete a project (owner or admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     responses:
   *       200:
   *         description: Project deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Only owner or admin can delete
   *       404:
   *         description: Project not found
   */
  router.delete(
    '/:projectId',
    authMiddleware,
    validationMiddleware(projectValidators.projectIdParamSchema, 'params'),
    projectController.delete.bind(projectController)
  );

  /**
   * @swagger
   * /api/v1/projects/{projectId}/visibility:
   *   patch:
   *     tags: [Projects]
   *     summary: Update project visibility
   *     description: Change project visibility (owner or admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateVisibilityRequest'
   *     responses:
   *       200:
   *         description: Visibility updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Only owner or admin can update visibility
   *       404:
   *         description: Project not found
   */
  router.patch(
    '/:projectId/visibility',
    authMiddleware,
    validationMiddleware(projectValidators.projectIdParamSchema, 'params'),
    validationMiddleware(projectValidators.updateVisibilitySchema),
    projectController.changeVisibility.bind(projectController)
  );

  /**
   * @swagger
   * /api/v1/projects/{projectId}/members:
   *   post:
   *     tags: [Projects]
   *     summary: Add a member to project
   *     description: Add a user as a project member (owner or admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AssignMemberRequest'
   *     responses:
   *       200:
   *         description: Member added successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Only owner or admin can add members
   *       404:
   *         description: Project or user not found
   */
  router.post(
    '/:projectId/members',
    authMiddleware,
    validationMiddleware(projectValidators.projectIdParamSchema, 'params'),
    validationMiddleware(projectValidators.assignMemberSchema),
    projectController.addMember.bind(projectController)
  );

  /**
   * @swagger
   * /api/v1/projects/{projectId}/members/{userId}:
   *   delete:
   *     tags: [Projects]
   *     summary: Remove a member from project
   *     description: Remove a user from project members (owner or admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID to remove
   *     responses:
   *       200:
   *         description: Member removed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Only owner or admin can remove members
   *       404:
   *         description: Project not found
   */
  router.delete(
    '/:projectId/members/:userId',
    authMiddleware,
    validationMiddleware(projectValidators.projectIdParamSchema, 'params'),
    projectController.removeMember.bind(projectController)
  );

  /**
   * @swagger
   * /api/v1/projects/{projectId}/members:
   *   get:
   *     tags: [Projects]
   *     summary: Get project members
   *     description: Get all members of a project (requires access to the project)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     responses:
   *       200:
   *         description: Members retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectMembersResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - No access to this project
   *       404:
   *         description: Project not found
   */
  router.get(
    '/:projectId/members',
    authMiddleware,
    validationMiddleware(projectValidators.projectIdParamSchema, 'params'),
    projectController.getMembers.bind(projectController)
  );

  return router;
};

module.exports = createProjectRoutes;
