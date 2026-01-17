/**
 * Unit Tests for Project Entity
 */
const Project = require('../../../../src/domain/entities/Project');

describe('Project Entity', () => {
  describe('Constructor', () => {
    it('should create a project with all properties', () => {
      const projectData = {
        id: '507f1f77bcf86cd799439011',
        name: 'Test Project',
        description: 'Test Description',
        ownerId: '507f1f77bcf86cd799439012',
        status: 'active',
        visibility: 'team',
        members: ['507f1f77bcf86cd799439020'],
      };

      const project = new Project(projectData);

      expect(project.id).toBe(projectData.id);
      expect(project.name).toBe(projectData.name);
      expect(project.description).toBe(projectData.description);
      expect(project.ownerId).toBe(projectData.ownerId);
      expect(project.status).toBe('active');
      expect(project.visibility).toBe('team');
      expect(project.members).toEqual(['507f1f77bcf86cd799439020']);
    });

    it('should use default values', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
      });

      expect(project.description).toBe('');
      expect(project.status).toBe('active');
      expect(project.visibility).toBe('team');
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
        members: ['507f1f77bcf86cd799439020', '507f1f77bcf86cd799439021'],
      });

      expect(project.isMember('507f1f77bcf86cd799439020')).toBe(true);
    });

    it('should return false if userId is not in members array', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        members: ['507f1f77bcf86cd799439020'],
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

  describe('isActive', () => {
    it('should return true for active projects', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        status: 'active',
      });

      expect(project.isActive()).toBe(true);
    });

    it('should return false for non-active projects', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        status: 'completed',
      });

      expect(project.isActive()).toBe(false);
    });
  });

  describe('isPublic', () => {
    it('should return true for public projects', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        visibility: 'public',
      });

      expect(project.isPublic()).toBe(true);
    });

    it('should return false for non-public projects', () => {
      const project = new Project({
        name: 'Test Project',
        ownerId: '507f1f77bcf86cd799439012',
        visibility: 'team',
      });

      expect(project.isPublic()).toBe(false);
    });
  });
});
