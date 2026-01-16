/**
 * Unit Tests for Project Entity
 */
const Project = require('../../../../src/domain/entities/Project');
const ProjectStatus = require('../../../../src/domain/enums/ProjectStatus');
const ProjectVisibility = require('../../../../src/domain/enums/ProjectVisibility');
const ValidationError = require('../../../../src/domain/errors/ValidationError');

describe('Project Entity', () => {
  describe('Constructor', () => {
    it('should create a project with valid data', () => {
      const projectData = {
        id: '507f1f77bcf86cd799439011',
        name: 'Test Project',
        description: 'Test Description',
        ownerId: '507f1f77bcf86cd799439012',
        status: ProjectStatus.ACTIVE,
        visibility: ProjectVisibility.PRIVATE,
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const project = new Project(projectData);

      expect(project.id).toBe(projectData.id);
      expect(project.name).toBe(projectData.name);
      expect(project.description).toBe(projectData.description);
      expect(project.ownerId).toBe(projectData.ownerId);
      expect(project.status).toBe(ProjectStatus.ACTIVE);
      expect(project.visibility).toBe(ProjectVisibility.PRIVATE);
    });

    it('should throw ValidationError for missing name', () => {
      const projectData = {
        ownerId: '507f1f77bcf86cd799439012',
      };

      expect(() => new Project(projectData)).toThrow(ValidationError);
      expect(() => new Project(projectData)).toThrow('Project name is required');
    });

    it('should throw ValidationError for missing ownerId', () => {
      const projectData = {
        name: 'Test Project',
      };

      expect(() => new Project(projectData)).toThrow(ValidationError);
      expect(() => new Project(projectData)).toThrow('Owner ID is required');
    });

    it('should throw ValidationError for invalid status', () => {
      const projectData = {
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        status: 'invalid_status',
      };

      expect(() => new Project(projectData)).toThrow(ValidationError);
      expect(() => new Project(projectData)).toThrow('Invalid project status');
    });

    it('should throw ValidationError for invalid visibility', () => {
      const projectData = {
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        visibility: 'invalid_visibility',
      };

      expect(() => new Project(projectData)).toThrow(ValidationError);
      expect(() => new Project(projectData)).toThrow('Invalid project visibility');
    });

    it('should default status to ACTIVE if not provided', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
      });

      expect(project.status).toBe(ProjectStatus.ACTIVE);
    });

    it('should default visibility to PRIVATE if not provided', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
      });

      expect(project.visibility).toBe(ProjectVisibility.PRIVATE);
    });

    it('should default members to empty array if not provided', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
      });

      expect(project.members).toEqual([]);
    });
  });

  describe('isOwner', () => {
    it('should return true if userId matches ownerId', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
      });

      expect(project.isOwner('507f1f77bcf86cd799439012')).toBe(true);
    });

    it('should return false if userId does not match ownerId', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
      });

      expect(project.isOwner('507f1f77bcf86cd799439099')).toBe(false);
    });
  });

  describe('isMember', () => {
    it('should return true if userId is in members array', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        members: [
          { userId: '507f1f77bcf86cd799439020', role: 'member' },
          { userId: '507f1f77bcf86cd799439021', role: 'member' },
        ],
      });

      expect(project.isMember('507f1f77bcf86cd799439020')).toBe(true);
    });

    it('should return false if userId is not in members array', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        members: [
          { userId: '507f1f77bcf86cd799439020', role: 'member' },
        ],
      });

      expect(project.isMember('507f1f77bcf86cd799439099')).toBe(false);
    });

    it('should return false for empty members array', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
      });

      expect(project.isMember('507f1f77bcf86cd799439020')).toBe(false);
    });
  });

  describe('hasAccess', () => {
    it('should return true if user is owner', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
      });

      expect(project.hasAccess('507f1f77bcf86cd799439012')).toBe(true);
    });

    it('should return true if user is member', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        members: [
          { userId: '507f1f77bcf86cd799439020', role: 'member' },
        ],
      });

      expect(project.hasAccess('507f1f77bcf86cd799439020')).toBe(true);
    });

    it('should return false if user is neither owner nor member', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        members: [
          { userId: '507f1f77bcf86cd799439020', role: 'member' },
        ],
      });

      expect(project.hasAccess('507f1f77bcf86cd799439099')).toBe(false);
    });
  });

  describe('addMember', () => {
    it('should add a member to the project', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
      });

      project.addMember('507f1f77bcf86cd799439020', 'member');

      expect(project.members).toHaveLength(1);
      expect(project.members[0].userId).toBe('507f1f77bcf86cd799439020');
      expect(project.members[0].role).toBe('member');
    });

    it('should not add duplicate members', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        members: [
          { userId: '507f1f77bcf86cd799439020', role: 'member' },
        ],
      });

      project.addMember('507f1f77bcf86cd799439020', 'member');

      expect(project.members).toHaveLength(1);
    });
  });

  describe('removeMember', () => {
    it('should remove a member from the project', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        members: [
          { userId: '507f1f77bcf86cd799439020', role: 'member' },
          { userId: '507f1f77bcf86cd799439021', role: 'member' },
        ],
      });

      project.removeMember('507f1f77bcf86cd799439020');

      expect(project.members).toHaveLength(1);
      expect(project.members[0].userId).toBe('507f1f77bcf86cd799439021');
    });

    it('should do nothing if member does not exist', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        members: [
          { userId: '507f1f77bcf86cd799439020', role: 'member' },
        ],
      });

      project.removeMember('507f1f77bcf86cd799439099');

      expect(project.members).toHaveLength(1);
    });
  });
});
