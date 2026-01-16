/**
 * Express Application Factory
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const config = require('./config/env');
const swaggerSpec = require('../presentation/swagger/swagger.config');

// Factories
const ServiceFactory = require('./factories/serviceFactory');
const RepositoryFactory = require('./factories/repositoryFactory');
const UseCaseFactory = require('./factories/useCaseFactory');
const ControllerFactory = require('./factories/controllerFactory');

// Middleware
const validationMiddleware = require('../presentation/middlewares/validationMiddleware');
const authMiddleware = require('../presentation/middlewares/authMiddleware');
const { roleMiddleware } = require('../presentation/middlewares/roleMiddleware');
const errorHandlerMiddleware = require('../presentation/middlewares/errorHandlerMiddleware');

// Routes
const createAuthRoutes = require('../presentation/routes/authRoutes');
const createUserRoutes = require('../presentation/routes/userRoutes');
const createProjectRoutes = require('../presentation/routes/projectRoutes');
const createTaskRoutes = require('../presentation/routes/taskRoutes');

// Validators
const authValidators = require('../presentation/validators/authValidators');
const projectValidators = require('../presentation/validators/projectValidators');

class AppFactory {
  static createApp({ logger, redisClient }) {
    const app = express();

    // Initialize factories
    const serviceFactory = new ServiceFactory({ logger, redisClient });
    const repositoryFactory = new RepositoryFactory({ logger });
    const useCaseFactory = new UseCaseFactory({ 
      repositoryFactory, 
      serviceFactory, 
      logger 
    });
    const controllerFactory = new ControllerFactory({ useCaseFactory, logger });

    // Security Middleware
    app.use(helmet({
      contentSecurityPolicy: false, // Disable CSP for Swagger UI
    }));
    app.use(cors({ origin: config.cors.origin }));

    // Body Parser & Compression
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.use(compression());

    // Swagger Documentation
    if (config.swagger.enabled) {
      app.use(
        config.swagger.url,
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
          explorer: true,
          customCss: '.swagger-ui .topbar { display: none }',
          customSiteTitle: 'Task Manager API Documentation',
          customfavIcon: '/favicon.ico',
        })
      );
      logger.info('Swagger documentation enabled', { url: config.swagger.url });
    }

    // Health Check Endpoint
    /**
     * @swagger
     * /api/health:
     *   get:
     *     summary: Health check
     *     description: Check if the API is running
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: API is healthy
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: OK
     *                 timestamp:
     *                   type: string
     *                   format: date-time
     *                   example: 2026-01-16T10:30:00.000Z
     */
    app.get('/api/health', (req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Create middleware instances
    const authMiddlewareInstance = authMiddleware({
      verifyTokenUseCase: useCaseFactory.getVerifyToken(),
      logger,
    });

    // API Routes
    const apiRouter = express.Router();

    // Auth Routes
    apiRouter.use(
      '/auth',
      createAuthRoutes({
        authController: controllerFactory.getAuthController(),
        authMiddleware: authMiddlewareInstance,
        validationMiddleware,
        authValidators,
      })
    );

    // User Routes
    apiRouter.use(
      '/users',
      createUserRoutes({
        userController: controllerFactory.getUserController(),
        authMiddleware: authMiddlewareInstance,
        roleMiddleware,
        validationMiddleware,
      })
    );

    // Project Routes
    apiRouter.use(
      '/projects',
      createProjectRoutes({
        projectController: controllerFactory.getProjectController(),
        taskController: controllerFactory.getTaskController(),
        authMiddleware: authMiddlewareInstance,
        roleMiddleware,
        validationMiddleware,
        projectValidators,
      })
    );

    // Task Routes
    apiRouter.use(
      '/tasks',
      createTaskRoutes({
        taskController: controllerFactory.getTaskController(),
        authMiddleware: authMiddlewareInstance,
        roleMiddleware,
        validationMiddleware,
      })
    );

    // Mount API routes
    app.use(`/api/${config.apiVersion}`, apiRouter);

    // 404 Handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    });

    // Error Handler (must be last)
    app.use(errorHandlerMiddleware(logger));

    return app;
  }
}

module.exports = AppFactory;
