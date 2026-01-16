/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User unique identifier
 *           example: 507f1f77bcf86cd799439011
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: user@example.com
 *         firstName:
 *           type: string
 *           description: User first name
 *           example: John
 *         lastName:
 *           type: string
 *           description: User last name
 *           example: Doe
 *         avatar:
 *           type: string
 *           format: uri
 *           description: User avatar URL
 *           example: https://example.com/avatar.jpg
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User role
 *           example: user
 *         isActive:
 *           type: boolean
 *           description: User active status
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *           description: Last login timestamp
 * 
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: John
 *         lastName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: Doe
 *         avatar:
 *           type: string
 *           format: uri
 *           example: https://example.com/avatar.jpg
 * 
 *     UpdateRoleRequest:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: admin
 * 
 *     UsersList:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserProfile'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 50
 *             total:
 *               type: integer
 *               example: 100
 */

module.exports = {};
