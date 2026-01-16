/**
 * Repository Factory
 * Creates and manages repository instances
 */
const UserRepository = require('../../infrastructure/repositories/UserRepository');
const RefreshTokenRepository = require('../../infrastructure/repositories/RefreshTokenRepository');
const ProjectRepository = require('../../infrastructure/repositories/ProjectRepository');
const TaskRepository = require('../../infrastructure/repositories/TaskRepository');

class RepositoryFactory {
  constructor({ logger }) {
    this.logger = logger;
    this.repositories = {};
  }

  /**
   * Get or create UserRepository
   */
  getUserRepository() {
    if (!this.repositories.userRepository) {
      this.repositories.userRepository = new UserRepository(this.logger);
    }
    return this.repositories.userRepository;
  }

  /**
   * Get or create RefreshTokenRepository
   */
  getRefreshTokenRepository() {
    if (!this.repositories.refreshTokenRepository) {
      this.repositories.refreshTokenRepository = new RefreshTokenRepository(this.logger);
    }
    return this.repositories.refreshTokenRepository;
  }

  /**
   * Get or create ProjectRepository
   */
  getProjectRepository() {
    if (!this.repositories.projectRepository) {
      this.repositories.projectRepository = new ProjectRepository(this.logger);
    }
    return this.repositories.projectRepository;
  }

  /**
   * Get or create TaskRepository
   */
  getTaskRepository() {
    if (!this.repositories.taskRepository) {
      this.repositories.taskRepository = new TaskRepository(this.logger);
    }
    return this.repositories.taskRepository;
  }
}

module.exports = RepositoryFactory;
