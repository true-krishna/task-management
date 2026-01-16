/**
 * Test Helper for Integration Tests
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const AppFactory = require('../../src/main/AppFactory');
const LoggerConfig = require('../../src/infrastructure/logging/LoggerConfig');
const WinstonLogger = require('../../src/infrastructure/logging/WinstonLogger');

class TestHelper {
  constructor() {
    this.app = null;
    this.mongoServer = null;
    this.server = null;
    this.logger = null;
  }

  async setup() {
    // Start in-memory MongoDB
    this.mongoServer = await MongoMemoryServer.create();
    const mongoUri = this.mongoServer.getUri();
    
    // Set test environment variables
    process.env.MONGODB_URI = mongoUri;
    process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-for-testing';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing';
    process.env.NODE_ENV = 'test';
    process.env.REDIS_HOST = 'localhost';
    process.env.REDIS_PORT = '6379';

    // Connect to in-memory database
    await mongoose.connect(mongoUri);

    // Initialize logger
    const winstonLogger = LoggerConfig.configure();
    this.logger = new WinstonLogger(winstonLogger);

    // Create Express app without Redis for tests
    this.app = AppFactory.createApp({ 
      logger: this.logger, 
      redisClient: null  // Tests run without Redis
    });
    
    // Start server on random port
    this.server = this.app.listen(0);

    return this.app;
  }

  async teardown() {
    // Close server
    if (this.server) {
      await new Promise((resolve) => this.server.close(resolve));
    }

    // Disconnect from MongoDB
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }

    // Stop in-memory MongoDB
    if (this.mongoServer) {
      await mongoServer.stop();
    }
  }

  async clearDatabase() {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany();
      }
    }
  }

  getApp() {
    return this.app;
  }
}

module.exports = TestHelper;
