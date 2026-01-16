/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *           description: User's email address (must be unique)
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: SecurePass123!
 *           description: Password (min 8 chars, must include uppercase, lowercase, number, and special character)
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: John
 *           description: User's first name
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Doe
 *           description: User's last name
 *         avatar:
 *           type: string
 *           format: uri
 *           example: https://example.com/avatar.jpg
 *           description: URL to user's avatar image (optional)
 *     
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePass123!
 *           description: User's password
 *     
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE...
 *           description: Refresh token received during login
 *     
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *           description: User's unique identifier
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *           description: User's email address
 *         firstName:
 *           type: string
 *           example: John
 *           description: User's first name
 *         lastName:
 *           type: string
 *           example: Doe
 *           description: User's last name
 *         avatar:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: https://example.com/avatar.jpg
 *           description: URL to user's avatar image
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *           description: User's role in the system
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: Whether the user account is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-01-16T10:30:00.000Z
 *           description: Account creation timestamp
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *           description: Whether the request was successful
 *         message:
 *           type: string
 *           example: Login successful
 *           description: Response message
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             accessToken:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE...
 *               description: JWT access token (expires in 15 minutes)
 *             refreshToken:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE...
 *               description: JWT refresh token (expires in 7 days)
 *     
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: User registered successfully
 *         data:
 *           $ref: '#/components/schemas/User'
 *     
 *     TokenResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Token refreshed successfully
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE...
 *               description: New JWT access token
 *             refreshToken:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE...
 *               description: New JWT refresh token
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation completed successfully
 *     
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/User'
 */

module.exports = {};
