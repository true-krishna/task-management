/**
 * Authentication Routes
 * Defines authentication-related endpoints
 */
const express = require('express');

const createAuthRoutes = ({ 
  authController, 
  authMiddleware, 
  validationMiddleware, 
  authValidators 
}) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/auth/register:
   *   post:
   *     summary: Register a new user
   *     description: Create a new user account with email, password, and personal information
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RegisterResponse'
   *       400:
   *         description: Validation error (invalid input data)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Conflict - Email already registered
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               success: false
   *               message: Email already registered
   */
  router.post(
    '/register',
    validationMiddleware(authValidators.register),
    (req, res, next) => authController.register(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: Login user
   *     description: Authenticate user with email and password, returns JWT tokens
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Invalid credentials or account deactivated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               success: false
   *               message: Invalid email or password
   */
  router.post(
    '/login',
    validationMiddleware(authValidators.login),
    (req, res, next) => authController.login(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     description: Generate new access and refresh tokens using a valid refresh token
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshTokenRequest'
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenResponse'
   *       401:
   *         description: Invalid or expired refresh token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               success: false
   *               message: Refresh token is expired or revoked
   */
  router.post(
    '/refresh',
    validationMiddleware(authValidators.refreshToken),
    (req, res, next) => authController.refresh(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/auth/logout:
   *   post:
   *     summary: Logout user
   *     description: Revoke refresh token and invalidate user session
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: Refresh token to revoke
   *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *             example:
   *               success: true
   *               message: Logout successful
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post(
    '/logout',
    authMiddleware,
    (req, res, next) => authController.logout(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/auth/me:
   *   get:
   *     summary: Get current user profile
   *     description: Retrieve the authenticated user's profile information
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               success: false
   *               message: No token provided
   */
  router.get(
    '/me',
    authMiddleware,
    (req, res, next) => authController.getMe(req, res, next)
  );

  return router;
};

module.exports = createAuthRoutes;
