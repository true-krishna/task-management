/**
 * Swagger/OpenAPI Configuration
 */
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../../main/config/env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'Task Manager Backend API with Clean Architecture, featuring authentication, user management, projects, and tasks.',
      contact: {
        name: 'API Support',
        email: 'support@taskmanager.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token (without "Bearer" prefix)',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message describing what went wrong',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Field validation error 1', 'Field validation error 2'],
            },
          },
        },
        AuditLog: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            entityType: {
              type: 'string',
              enum: ['user', 'project', 'task'],
              example: 'task',
            },
            entityId: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            action: {
              type: 'string',
              enum: ['create', 'update', 'delete', 'assign', 'unassign', 'status_change', 'priority_change'],
              example: 'status_change',
            },
            userId: {
              type: 'string',
              example: '507f1f77bcf86cd799439013',
            },
            changes: {
              type: 'object',
              example: { status: { from: 'in_progress', to: 'completed' } },
            },
            ipAddress: {
              type: 'string',
              nullable: true,
              example: '192.168.1.1',
            },
            userAgent: {
              type: 'string',
              nullable: true,
              example: 'Mozilla/5.0',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-16T10:30:00.000Z',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              example: 156,
            },
            limit: {
              type: 'integer',
              example: 50,
            },
            skip: {
              type: 'integer',
              example: 0,
            },
            hasMore: {
              type: 'boolean',
              example: true,
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized - invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden - insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Users',
        description: 'User management and profile endpoints',
      },
      {
        name: 'Projects',
        description: 'Project management endpoints',
      },
      {
        name: 'Tasks',
        description: 'Task management and Kanban board endpoints',
      },
      {
        name: 'Dashboard',
        description: 'Dashboard and analytics endpoints',
      },
      {
        name: 'Audit',
        description: 'Audit trail and activity log endpoints',
      },
      {
        name: 'Health',
        description: 'API health check endpoints',
      },
    ],
  },
  apis: [
    './src/presentation/routes/*.js',
    './src/presentation/swagger/schemas/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
