/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProjectRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Project name
 *           example: "E-commerce Platform"
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Project description
 *           example: "Building a modern e-commerce platform with React and Node.js"
 *         status:
 *           type: string
 *           enum: [planning, active, on-hold, completed, archived]
 *           description: Project status
 *           example: "planning"
 *         visibility:
 *           type: string
 *           enum: [private, team, public]
 *           description: Project visibility
 *           example: "team"
 *
 *     UpdateProjectRequest:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Project name
 *           example: "Updated Project Name"
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Project description
 *           example: "Updated project description"
 *         status:
 *           type: string
 *           enum: [planning, active, on-hold, completed, archived]
 *           description: Project status
 *           example: "active"
 *
 *     UpdateVisibilityRequest:
 *       type: object
 *       required:
 *         - visibility
 *       properties:
 *         visibility:
 *           type: string
 *           enum: [private, team, public]
 *           description: New visibility setting
 *           example: "public"
 *
 *     AssignMemberRequest:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user to add as member
 *           example: "507f1f77bcf86cd799439011"
 *
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Project ID
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           description: Project name
 *           example: "E-commerce Platform"
 *         description:
 *           type: string
 *           description: Project description
 *           example: "Building a modern e-commerce platform"
 *         status:
 *           type: string
 *           enum: [planning, active, on-hold, completed, archived]
 *           description: Project status
 *           example: "active"
 *         visibility:
 *           type: string
 *           enum: [private, team, public]
 *           description: Project visibility
 *           example: "team"
 *         ownerId:
 *           type: string
 *           description: Owner's user ID
 *           example: "507f1f77bcf86cd799439012"
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of member user IDs
 *           example: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *         createdBy:
 *           type: string
 *           description: Creator's user ID
 *           example: "507f1f77bcf86cd799439012"
 *         modifiedBy:
 *           type: string
 *           description: Last modifier's user ID
 *           example: "507f1f77bcf86cd799439012"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2024-01-15T14:45:00.000Z"
 *
 *     ProjectMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *           example: "507f1f77bcf86cd799439011"
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *           example: "john.doe@example.com"
 *         firstName:
 *           type: string
 *           description: First name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: Last name
 *           example: "Doe"
 *         avatar:
 *           type: string
 *           description: Avatar URL
 *           example: "https://example.com/avatar.jpg"
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User role
 *           example: "user"
 *
 *     ProjectResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Project created successfully"
 *         data:
 *           $ref: '#/components/schemas/Project'
 *
 *     ProjectDataResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Project'
 *
 *     ProjectListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 45
 *             totalPages:
 *               type: integer
 *               example: 5
 *
 *     ProjectMembersResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             projectId:
 *               type: string
 *               example: "507f1f77bcf86cd799439011"
 *             projectName:
 *               type: string
 *               example: "E-commerce Platform"
 *             members:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectMember'
 */

module.exports = {};
