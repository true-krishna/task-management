/**
 * Application Server Entry Point
 */
const config = require('./config/env');
const AppFactory = require('./AppFactory');
const LoggerConfig = require('../infrastructure/logging/LoggerConfig');
const WinstonLogger = require('../infrastructure/logging/WinstonLogger');
const MongoDBConnection = require('../infrastructure/config/database.config');
const RedisClient = require('../infrastructure/config/redis.config');

class Server {
  constructor() {
    this.logger = null;
    this.app = null;
    this.server = null;
  }

  async initialize() {
    try {
      // Initialize Logger
      const winstonLogger = LoggerConfig.configure();
      this.logger = new WinstonLogger(winstonLogger);
      this.logger.info('Logger initialized', { nodeEnv: config.nodeEnv });

      // Initialize MongoDB
      const mongoDb = MongoDBConnection.getInstance();
      await mongoDb.connect(this.logger);

      // Initialize Redis
      const redis = RedisClient.getInstance();
      await redis.connect(this.logger);
      const redisClient = redis.getClient();

      // Create Express App with dependencies
      this.app = AppFactory.createApp({ logger: this.logger, redisClient });
      this.logger.info('Express app created with authentication routes');

      return this.app;
    } catch (error) {
      if (this.logger) {
        this.logger.error('Server initialization failed', { error: error.message });
      } else {
        console.error('Server initialization failed', error);
      }
      throw error;
    }
  }

  async start() {
    try {
      await this.initialize();

      this.server = this.app.listen(config.port, () => {
        this.logger.info('Server started', {
          port: config.port,
          nodeEnv: config.nodeEnv,
          apiVersion: config.apiVersion,
        });
      });

      // Handle server errors
      this.server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          this.logger.error(`Port ${config.port} is already in use`);
        } else {
          this.logger.error('Server error', { error: error.message });
        }
        process.exit(1);
      });

      // Graceful shutdown
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());
    } catch (error) {
      if (this.logger) {
        this.logger.error('Failed to start server', { error: error.message });
      }
      process.exit(1);
    }
  }

  async shutdown() {
    this.logger.info('Shutting down server...');

    if (this.server) {
      this.server.close(() => {
        this.logger.info('Server closed');
      });
    }

    // Disconnect MongoDB
    const mongoDb = MongoDBConnection.getInstance();
    await mongoDb.disconnect(this.logger);

    // Disconnect Redis
    const redis = RedisClient.getInstance();
    await redis.disconnect(this.logger);

    process.exit(0);
  }
}

// Start server if this is the entry point
if (require.main === module) {
  const server = new Server();
  server.start();
}

module.exports = Server;
