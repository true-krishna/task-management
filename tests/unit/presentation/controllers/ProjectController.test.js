const ProjectController = require('../../../../src/presentation/controllers/ProjectController');

describe('ProjectController', () => {
  let projectController;
  let useCases;
  let mockLogger;
  let req, res, next;

  beforeEach(() => {
    useCases = {
      createProject: { execute: jest.fn() },
      getProject: { execute: jest.fn() },
      getAllProjects: { execute: jest.fn() },
      updateProject: { execute: jest.fn() },
      updateProjectVisibility: { execute: jest.fn() },
      deleteProject: { execute: jest.fn() },
      assignUserToProject: { execute: jest.fn() },
      removeUserFromProject: { execute: jest.fn() },
      getProjectMembers: { execute: jest.fn() },
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    projectController = new ProjectController({
      useCases,
      logger: mockLogger,
    });

    req = {
      user: { id: 'user123', role: 'user' },
      params: {},
      query: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('createProject', () => {
    it('should create project successfully', async () => {
      req.body = {
        name: 'New Project',
        description: 'Project description',
      };

      const mockProject = {
        id: 'project123',
        name: 'New Project',
        ownerId: 'user123',
      };

      useCases.createProject.execute.mockResolvedValue(mockProject);

      await projectController.createProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Project created successfully',
        data: mockProject,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Creation failed');
      useCases.createProject.execute.mockRejectedValue(error);

      await projectController.createProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getProject', () => {
    it('should get project successfully', async () => {
      req.params.projectId = 'project123';
      const mockProject = { id: 'project123', name: 'Project' };

      useCases.getProject.execute.mockResolvedValue(mockProject);

      await projectController.getProject(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProject,
      });
    });

    it('should handle errors', async () => {
      req.params.projectId = 'project123';
      const error = new Error('Not found');
      useCases.getProject.execute.mockRejectedValue(error);

      await projectController.getProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllProjects', () => {
    it('should get all projects successfully', async () => {
      req.query = { status: 'active', limit: '10' };

      const mockProjects = [
        { id: 'project1', name: 'Project 1' },
        { id: 'project2', name: 'Project 2' },
      ];

      useCases.getAllProjects.execute.mockResolvedValue(mockProjects);

      await projectController.getAllProjects(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProjects,
      });
    });
  });

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      req.params.projectId = 'project123';
      req.body = { name: 'Updated Project' };

      const mockProject = { id: 'project123', name: 'Updated Project' };
      useCases.updateProject.execute.mockResolvedValue(mockProject);

      await projectController.updateProject(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Project updated successfully',
        data: mockProject,
      });
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      req.params.projectId = 'project123';

      useCases.deleteProject.execute.mockResolvedValue(true);

      await projectController.deleteProject(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Project deleted successfully',
      });
    });
  });

  describe('assignUserToProject', () => {
    it('should assign user successfully', async () => {
      req.params.projectId = 'project123';
      req.body = { userId: 'user456' };

      const mockProject = {
        id: 'project123',
        members: ['user456'],
      };

      useCases.assignUserToProject.execute.mockResolvedValue(mockProject);

      await projectController.assignUserToProject(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User assigned to project successfully',
        data: mockProject,
      });
    });
  });
});
