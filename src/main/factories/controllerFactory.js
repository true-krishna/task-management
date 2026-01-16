/**
 * Controller Factory
 * Creates and manages controller instances
 */
const AuthController = require('../../presentation/controllers/AuthController');
const UserController = require('../../presentation/controllers/UserController');
const ProjectController = require('../../presentation/controllers/ProjectController');
const TaskController = require('../../presentation/controllers/TaskController');
const DashboardController = require('../../presentation/controllers/DashboardController');
const AuditLogController = require('../../presentation/controllers/AuditLogController');

class ControllerFactory {
  constructor({ useCaseFactory, logger }) {
    this.useCaseFactory = useCaseFactory;
    this.logger = logger;
    this.controllers = {};
  }

  /**
   * Get or create AuthController
   */
  getAuthController() {
    if (!this.controllers.authController) {
      this.controllers.authController = new AuthController({
        registerUser: this.useCaseFactory.getRegisterUser(),
        loginUser: this.useCaseFactory.getLoginUser(),
        refreshToken: this.useCaseFactory.getRefreshToken(),
        logoutUser: this.useCaseFactory.getLogoutUser(),
        verifyToken: this.useCaseFactory.getVerifyToken(),
        logger: this.logger,
      });
    }
    return this.controllers.authController;
  }

  /**
   * Get or create UserController
   */
  getUserController() {
    if (!this.controllers.userController) {
      this.controllers.userController = new UserController({
        getUserProfile: this.useCaseFactory.getUserProfile(),
        updateUserProfile: this.useCaseFactory.getUpdateUserProfile(),
        getAllUsers: this.useCaseFactory.getGetAllUsers(),
        updateUserRole: this.useCaseFactory.getUpdateUserRole(),
        deactivateUser: this.useCaseFactory.getDeactivateUser(),
        logger: this.logger,
      });
    }
    return this.controllers.userController;
  }

  /**
   * Get or create ProjectController
   */
  getProjectController() {
    if (!this.controllers.projectController) {
      this.controllers.projectController = new ProjectController({
        createProject: this.useCaseFactory.getCreateProject(),
        getProject: this.useCaseFactory.getGetProject(),
        getAllProjects: this.useCaseFactory.getGetAllProjects(),
        updateProject: this.useCaseFactory.getUpdateProject(),
        deleteProject: this.useCaseFactory.getDeleteProject(),
        updateProjectVisibility: this.useCaseFactory.getUpdateProjectVisibility(),
        assignUserToProject: this.useCaseFactory.getAssignUserToProject(),
        removeUserFromProject: this.useCaseFactory.getRemoveUserFromProject(),
        getProjectMembers: this.useCaseFactory.getGetProjectMembers(),
        logger: this.logger,
      });
    }
    return this.controllers.projectController;
  }

  /**
   * Get or create TaskController
   */
  getTaskController() {
    if (!this.controllers.taskController) {
      this.controllers.taskController = new TaskController({
        useCases: {
          createTask: this.useCaseFactory.getCreateTask(),
          getTask: this.useCaseFactory.getGetTask(),
          getProjectTasks: this.useCaseFactory.getGetProjectTasks(),
          updateTask: this.useCaseFactory.getUpdateTask(),
          updateTaskStatus: this.useCaseFactory.getUpdateTaskStatus(),
          updateTaskPriority: this.useCaseFactory.getUpdateTaskPriority(),
          reorderTasks: this.useCaseFactory.getReorderTasks(),
          assignTask: this.useCaseFactory.getAssignTask(),
          deleteTask: this.useCaseFactory.getDeleteTask(),
        },
        logger: this.logger,
      });
    }
    return this.controllers.taskController;
  }

  /**
   * Get or create DashboardController
   */
  getDashboardController() {
    if (!this.controllers.dashboardController) {
      this.controllers.dashboardController = new DashboardController({
        getDashboardStats: this.useCaseFactory.getGetDashboardStats(),
        getTaskDistribution: this.useCaseFactory.getGetTaskDistribution(),
        getPriorityDistribution: this.useCaseFactory.getGetPriorityDistribution(),
        getWeeklyTrend: this.useCaseFactory.getGetWeeklyTrend(),
        logger: this.logger,
      });
    }
    return this.controllers.dashboardController;
  }

  /**
   * Get or create AuditLogController
   */
  getAuditLogController() {
    if (!this.controllers.auditLogController) {
      this.controllers.auditLogController = new AuditLogController({
        logActivity: this.useCaseFactory.getLogActivity(),
        getEntityActivity: this.useCaseFactory.getGetEntityActivity(),
        getUserActivity: this.useCaseFactory.getGetUserActivity(),
        getAllActivity: this.useCaseFactory.getGetAllActivity(),
        getActivityStatistics: this.useCaseFactory.getGetActivityStatistics(),
        logger: this.logger,
      });
    }
    return this.controllers.auditLogController;
  }
}

module.exports = ControllerFactory;
