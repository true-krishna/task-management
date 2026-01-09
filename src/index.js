/**
 * Application Index
 * Entry point for the application
 */

module.exports = {
  // Domain entities
  entities: {
    User: require('./domain/entities/User'),
    Project: require('./domain/entities/Project'),
    Task: require('./domain/entities/Task'),
    RefreshToken: require('./domain/entities/RefreshToken'),
    AuditLog: require('./domain/entities/AuditLog'),
  },

  // Domain enums
  enums: {
    UserRole: require('./domain/enums/UserRole'),
    ProjectStatus: require('./domain/enums/ProjectStatus'),
    ProjectVisibility: require('./domain/enums/ProjectVisibility'),
    TaskStatus: require('./domain/enums/TaskStatus'),
    TaskPriority: require('./domain/enums/TaskPriority'),
  },

  // Domain errors
  errors: {
    DomainError: require('./domain/errors/DomainError'),
    ValidationError: require('./domain/errors/ValidationError'),
    AuthenticationError: require('./domain/errors/AuthenticationError'),
    AuthorizationError: require('./domain/errors/AuthorizationError'),
    NotFoundError: require('./domain/errors/NotFoundError'),
    ConflictError: require('./domain/errors/ConflictError'),
  },

  // Domain interfaces
  interfaces: {
    repositories: {
      IUserRepository: require('./domain/interfaces/repositories/IUserRepository'),
      IProjectRepository: require('./domain/interfaces/repositories/IProjectRepository'),
      ITaskRepository: require('./domain/interfaces/repositories/ITaskRepository'),
      IRefreshTokenRepository: require('./domain/interfaces/repositories/IRefreshTokenRepository'),
      IAuditLogRepository: require('./domain/interfaces/repositories/IAuditLogRepository'),
    },
    services: {
      IPasswordService: require('./domain/interfaces/services/IPasswordService'),
      ITokenService: require('./domain/interfaces/services/ITokenService'),
      ICacheService: require('./domain/interfaces/services/ICacheService'),
      ILogger: require('./domain/interfaces/services/ILogger'),
    },
  },

  // Infrastructure
  infrastructure: {
    cache: {
      CacheService: require('./infrastructure/cache/CacheService'),
    },
    logging: {
      LoggerConfig: require('./infrastructure/logging/LoggerConfig'),
      WinstonLogger: require('./infrastructure/logging/WinstonLogger'),
    },
    config: {
      database: require('./infrastructure/config/database.config'),
      redis: require('./infrastructure/config/redis.config'),
    },
  },

  // Main
  main: {
    config: require('./main/config/env'),
    AppFactory: require('./main/AppFactory'),
    Server: require('./main/server'),
  },
};
