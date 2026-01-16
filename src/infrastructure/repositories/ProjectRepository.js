/**
 * Project Repository Implementation
 * Handles data access for Project entities
 */
const IProjectRepository = require('../../domain/interfaces/repositories/IProjectRepository');
const Project = require('../../domain/entities/Project');
const ProjectModel = require('../database/mongoose/models/ProjectModel');

class ProjectRepository extends IProjectRepository {
  constructor(logger) {
    super();
    this.logger = logger;
  }

  /**
   * Create a new project
   */
  async create(projectData) {
    try {
      const project = new ProjectModel(projectData);
      const savedProject = await project.save();
      return this._mapToEntity(savedProject);
    } catch (error) {
      this.logger.error('Error creating project', { error: error.message });
      throw error;
    }
  }

  /**
   * Find project by ID
   */
  async findById(id) {
    try {
      const project = await ProjectModel.findById(id);
      return project ? this._mapToEntity(project) : null;
    } catch (error) {
      this.logger.error('Error finding project by ID', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Find all projects with filters
   */
  async findAll(filter = {}, options = {}) {
    try {
      const { page = 1, limit = 50, sort = { createdAt: -1 } } = options;
      const skip = (page - 1) * limit;

      const projects = await ProjectModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      return projects.map(project => this._mapToEntity(project));
    } catch (error) {
      this.logger.error('Error finding projects', { error: error.message });
      throw error;
    }
  }

  /**
   * Find projects by owner ID
   */
  async findByOwnerId(ownerId, options = {}) {
    try {
      return await this.findAll({ ownerId }, options);
    } catch (error) {
      this.logger.error('Error finding projects by owner', { error: error.message, ownerId });
      throw error;
    }
  }

  /**
   * Find projects where user is a member
   */
  async findByMemberId(userId, options = {}) {
    try {
      return await this.findAll({ members: userId }, options);
    } catch (error) {
      this.logger.error('Error finding projects by member', { error: error.message, userId });
      throw error;
    }
  }

  /**
   * Find public projects
   */
  async findPublicProjects(options = {}) {
    try {
      return await this.findAll({ visibility: 'public' }, options);
    } catch (error) {
      this.logger.error('Error finding public projects', { error: error.message });
      throw error;
    }
  }

  /**
   * Update project
   */
  async update(id, updateData) {
    try {
      const project = await ProjectModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      return project ? this._mapToEntity(project) : null;
    } catch (error) {
      this.logger.error('Error updating project', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Delete project
   */
  async delete(id) {
    try {
      const project = await ProjectModel.findByIdAndDelete(id);
      return project ? this._mapToEntity(project) : null;
    } catch (error) {
      this.logger.error('Error deleting project', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Add member to project
   */
  async addMember(projectId, userId) {
    try {
      const project = await ProjectModel.findByIdAndUpdate(
        projectId,
        { $addToSet: { members: userId } },
        { new: true }
      );
      return project ? this._mapToEntity(project) : null;
    } catch (error) {
      this.logger.error('Error adding member to project', { error: error.message, projectId, userId });
      throw error;
    }
  }

  /**
   * Remove member from project
   */
  async removeMember(projectId, userId) {
    try {
      const project = await ProjectModel.findByIdAndUpdate(
        projectId,
        { $pull: { members: userId } },
        { new: true }
      );
      return project ? this._mapToEntity(project) : null;
    } catch (error) {
      this.logger.error('Error removing member from project', { error: error.message, projectId, userId });
      throw error;
    }
  }

  /**
   * Check if user is member of project
   */
  async isMember(projectId, userId) {
    try {
      const project = await ProjectModel.findOne({
        _id: projectId,
        members: userId
      });
      return !!project;
    } catch (error) {
      this.logger.error('Error checking project membership', { error: error.message, projectId, userId });
      throw error;
    }
  }

  /**
   * Count projects by filter
   */
  async count(filter = {}) {
    try {
      return await ProjectModel.countDocuments(filter);
    } catch (error) {
      this.logger.error('Error counting projects', { error: error.message });
      throw error;
    }
  }

  /**
   * Map Mongoose document to domain entity
   */
  _mapToEntity(doc) {
    if (!doc) return null;

    return new Project({
      id: doc._id ? doc._id.toString() : doc.id,
      name: doc.name,
      description: doc.description,
      status: doc.status,
      visibility: doc.visibility,
      ownerId: doc.ownerId ? doc.ownerId.toString() : doc.ownerId,
      members: doc.members ? doc.members.map(m => m.toString()) : [],
      createdBy: doc.createdBy ? doc.createdBy.toString() : doc.createdBy,
      modifiedBy: doc.modifiedBy ? doc.modifiedBy.toString() : doc.modifiedBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

module.exports = ProjectRepository;
