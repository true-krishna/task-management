/**
 * Environment Configuration Loader
 */
require('dotenv').config();

const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiVersion: process.env.API_VERSION || 'v1',

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/taskmanager_test',
  },

  // Redis Cache
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB || 0,
    ttlDefault: process.env.REDIS_TTL_DEFAULT || 300,
    enabled: process.env.CACHE_ENABLED === 'true',
  },

  // JWT
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-secret-access-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-secret-refresh-key',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  // Security
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    filePath: process.env.LOG_FILE_PATH || './logs',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
  },

  // Swagger
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    url: process.env.SWAGGER_URL || '/api-docs',
  },

  // Cache TTL
  cacheTtl: {
    userProfile: 3600, // 1 hour
    userList: 300, // 5 minutes
    project: 600, // 10 minutes
    projectUserList: 300, // 5 minutes
    task: 120, // 2 minutes
    taskProject: 120, // 2 minutes
    dashboardStats: 300, // 5 minutes
    dashboardDistribution: 300, // 5 minutes
  },
};

module.exports = config;
