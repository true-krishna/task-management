/**
 * Use Case Factory
 * Creates and manages use case instances
 */
// Auth use cases
const RegisterUser = require('../../application/use-cases/auth/RegisterUser');
const LoginUser = require('../../application/use-cases/auth/LoginUser');
const RefreshToken = require('../../application/use-cases/auth/RefreshToken');
const LogoutUser = require('../../application/use-cases/auth/LogoutUser');
const VerifyToken = require('../../application/use-cases/auth/VerifyToken');

// User use cases
const GetUserProfile = require('../../application/use-cases/user/GetUserProfile');
const UpdateUserProfile = require('../../application/use-cases/user/UpdateUserProfile');
const GetAllUsers = require('../../application/use-cases/user/GetAllUsers');
const UpdateUserRole = require('../../application/use-cases/user/UpdateUserRole');
const DeactivateUser = require('../../application/use-cases/user/DeactivateUser');

// Project use cases
const CreateProject = require('../../application/use-cases/project/CreateProject');
const GetProject = require('../../application/use-cases/project/GetProject');
const GetAllProjects = require('../../application/use-cases/project/GetAllProjects');
const UpdateProject = require('../../application/use-cases/project/UpdateProject');
const DeleteProject = require('../../application/use-cases/project/DeleteProject');
const UpdateProjectVisibility = require('../../application/use-cases/project/UpdateProjectVisibility');
const AssignUserToProject = require('../../application/use-cases/project/AssignUserToProject');
const RemoveUserFromProject = require('../../application/use-cases/project/RemoveUserFromProject');
const GetProjectMembers = require('../../application/use-cases/project/GetProjectMembers');

class UseCaseFactory {
  constructor({ repositoryFactory, serviceFactory, logger }) {
    this.repositoryFactory = repositoryFactory;
    this.serviceFactory = serviceFactory;
    this.logger = logger;
    this.useCases = {};
  }

  /**
   * Get or create RegisterUser use case
   */
  getRegisterUser() {
    if (!this.useCases.registerUser) {
      this.useCases.registerUser = new RegisterUser({
        userRepository: this.repositoryFactory.getUserRepository(),
        passwordService: this.serviceFactory.getPasswordService(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.registerUser;
  }

  /**
   * Get or create LoginUser use case
   */
  getLoginUser() {
    if (!this.useCases.loginUser) {
      this.useCases.loginUser = new LoginUser({
        userRepository: this.repositoryFactory.getUserRepository(),
        refreshTokenRepository: this.repositoryFactory.getRefreshTokenRepository(),
        passwordService: this.serviceFactory.getPasswordService(),
        tokenService: this.serviceFactory.getTokenService(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.loginUser;
  }

  /**
   * Get or create RefreshToken use case
   */
  getRefreshToken() {
    if (!this.useCases.refreshToken) {
      this.useCases.refreshToken = new RefreshToken({
        userRepository: this.repositoryFactory.getUserRepository(),
        refreshTokenRepository: this.repositoryFactory.getRefreshTokenRepository(),
        tokenService: this.serviceFactory.getTokenService(),
        logger: this.logger,
      });
    }
    return this.useCases.refreshToken;
  }

  /**
   * Get or create LogoutUser use case
   */
  getLogoutUser() {
    if (!this.useCases.logoutUser) {
      this.useCases.logoutUser = new LogoutUser({
        refreshTokenRepository: this.repositoryFactory.getRefreshTokenRepository(),
        tokenService: this.serviceFactory.getTokenService(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.logoutUser;
  }

  /**
   * Get or create VerifyToken use case
   */
  getVerifyToken() {
    if (!this.useCases.verifyToken) {
      this.useCases.verifyToken = new VerifyToken({
        userRepository: this.repositoryFactory.getUserRepository(),
        tokenService: this.serviceFactory.getTokenService(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.verifyToken;
  }

  /**
   * Get or create GetUserProfile use case
   */
  getUserProfile() {
    if (!this.useCases.getUserProfile) {
      this.useCases.getUserProfile = new GetUserProfile({
        userRepository: this.repositoryFactory.getUserRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.getUserProfile;
  }

  /**
   * Get or create UpdateUserProfile use case
   */
  getUpdateUserProfile() {
    if (!this.useCases.updateUserProfile) {
      this.useCases.updateUserProfile = new UpdateUserProfile({
        userRepository: this.repositoryFactory.getUserRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.updateUserProfile;
  }

  /**
   * Get or create GetAllUsers use case
   */
  getGetAllUsers() {
    if (!this.useCases.getAllUsers) {
      this.useCases.getAllUsers = new GetAllUsers({
        userRepository: this.repositoryFactory.getUserRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.getAllUsers;
  }

  /**
   * Get or create UpdateUserRole use case
   */
  getUpdateUserRole() {
    if (!this.useCases.updateUserRole) {
      this.useCases.updateUserRole = new UpdateUserRole({
        userRepository: this.repositoryFactory.getUserRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.updateUserRole;
  }

  /**
   * Get or create DeactivateUser use case
   */
  getDeactivateUser() {
    if (!this.useCases.deactivateUser) {
      this.useCases.deactivateUser = new DeactivateUser({
        userRepository: this.repositoryFactory.getUserRepository(),
        refreshTokenRepository: this.repositoryFactory.getRefreshTokenRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.deactivateUser;
  }

  /**
   * Get or create CreateProject use case
   */
  getCreateProject() {
    if (!this.useCases.createProject) {
      this.useCases.createProject = new CreateProject({
        projectRepository: this.repositoryFactory.getProjectRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.createProject;
  }

  /**
   * Get or create GetProject use case
   */
  getGetProject() {
    if (!this.useCases.getProject) {
      this.useCases.getProject = new GetProject({
        projectRepository: this.repositoryFactory.getProjectRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.getProject;
  }

  /**
   * Get or create GetAllProjects use case
   */
  getGetAllProjects() {
    if (!this.useCases.getAllProjects) {
      this.useCases.getAllProjects = new GetAllProjects({
        projectRepository: this.repositoryFactory.getProjectRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.getAllProjects;
  }

  /**
   * Get or create UpdateProject use case
   */
  getUpdateProject() {
    if (!this.useCases.updateProject) {
      this.useCases.updateProject = new UpdateProject({
        projectRepository: this.repositoryFactory.getProjectRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.updateProject;
  }

  /**
   * Get or create DeleteProject use case
   */
  getDeleteProject() {
    if (!this.useCases.deleteProject) {
      this.useCases.deleteProject = new DeleteProject({
        projectRepository: this.repositoryFactory.getProjectRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.deleteProject;
  }

  /**
   * Get or create UpdateProjectVisibility use case
   */
  getUpdateProjectVisibility() {
    if (!this.useCases.updateProjectVisibility) {
      this.useCases.updateProjectVisibility = new UpdateProjectVisibility({
        projectRepository: this.repositoryFactory.getProjectRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.updateProjectVisibility;
  }

  /**
   * Get or create AssignUserToProject use case
   */
  getAssignUserToProject() {
    if (!this.useCases.assignUserToProject) {
      this.useCases.assignUserToProject = new AssignUserToProject({
        projectRepository: this.repositoryFactory.getProjectRepository(),
        userRepository: this.repositoryFactory.getUserRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.assignUserToProject;
  }

  /**
   * Get or create RemoveUserFromProject use case
   */
  getRemoveUserFromProject() {
    if (!this.useCases.removeUserFromProject) {
      this.useCases.removeUserFromProject = new RemoveUserFromProject({
        projectRepository: this.repositoryFactory.getProjectRepository(),
        cacheService: this.serviceFactory.getCacheService(),
        logger: this.logger,
      });
    }
    return this.useCases.removeUserFromProject;
  }

  /**
   * Get or create GetProjectMembers use case
   */
  getGetProjectMembers() {
    if (!this.useCases.getProjectMembers) {
      this.useCases.getProjectMembers = new GetProjectMembers({
        projectRepository: this.repositoryFactory.getProjectRepository(),
        userRepository: this.repositoryFactory.getUserRepository(),
        logger: this.logger,
      });
    }
    return this.useCases.getProjectMembers;
  }
}

module.exports = UseCaseFactory;
