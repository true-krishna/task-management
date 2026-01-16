const Joi = require('joi');
const ProjectStatus = require('../../domain/enums/ProjectStatus');
const ProjectVisibility = require('../../domain/enums/ProjectVisibility');

/**
 * Validation schemas for project endpoints
 */

const projectIdParamSchema = Joi.object({
  projectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid project ID format',
      'any.required': 'Project ID is required',
    }),
});

const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Project name must be at least 3 characters long',
    'string.max': 'Project name must not exceed 100 characters',
    'any.required': 'Project name is required',
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  status: Joi.string()
    .valid(...Object.values(ProjectStatus))
    .optional()
    .messages({
      'any.only': `Status must be one of: ${Object.values(ProjectStatus).join(', ')}`,
    }),
  visibility: Joi.string()
    .valid(...Object.values(ProjectVisibility))
    .optional()
    .messages({
      'any.only': `Visibility must be one of: ${Object.values(ProjectVisibility).join(', ')}`,
    }),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    'string.min': 'Project name must be at least 3 characters long',
    'string.max': 'Project name must not exceed 100 characters',
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  status: Joi.string()
    .valid(...Object.values(ProjectStatus))
    .optional()
    .messages({
      'any.only': `Status must be one of: ${Object.values(ProjectStatus).join(', ')}`,
    }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided to update',
  });

const updateVisibilitySchema = Joi.object({
  visibility: Joi.string()
    .valid(...Object.values(ProjectVisibility))
    .required()
    .messages({
      'any.only': `Visibility must be one of: ${Object.values(ProjectVisibility).join(', ')}`,
      'any.required': 'Visibility is required',
    }),
});

const assignMemberSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required',
    }),
});

const getAllProjectsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    'number.min': 'Page must be at least 1',
    'number.base': 'Page must be a number',
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100',
    'number.base': 'Limit must be a number',
  }),
  status: Joi.string()
    .valid(...Object.values(ProjectStatus))
    .optional()
    .messages({
      'any.only': `Status must be one of: ${Object.values(ProjectStatus).join(', ')}`,
    }),
  visibility: Joi.string()
    .valid(...Object.values(ProjectVisibility))
    .optional()
    .messages({
      'any.only': `Visibility must be one of: ${Object.values(ProjectVisibility).join(', ')}`,
    }),
});

module.exports = {
  projectIdParamSchema,
  createProjectSchema,
  updateProjectSchema,
  updateVisibilitySchema,
  assignMemberSchema,
  getAllProjectsQuerySchema,
};
