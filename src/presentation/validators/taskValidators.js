const Joi = require('joi');

/**
 * Validator schemas for Task operations
 */

const taskIdParamSchema = Joi.object({
  taskId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid task ID format',
      'any.required': 'Task ID is required',
    }),
});

const projectIdParamSchema = Joi.object({
  projectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid project ID format',
      'any.required': 'Project ID is required',
    }),
});

const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required',
    }),
  description: Joi.string()
    .max(2000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 2000 characters',
    }),
  projectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid project ID format',
      'any.required': 'Project ID is required',
    }),
  status: Joi.string()
    .valid('not_started', 'in_progress', 'completed')
    .default('not_started')
    .messages({
      'any.only': 'Status must be one of: not_started, in_progress, completed',
    }),
  priority: Joi.string()
    .valid('none', 'low', 'medium', 'high')
    .default('none')
    .messages({
      'any.only': 'Priority must be one of: none, low, medium, high',
    }),
  assigneeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid assignee ID format',
    }),
  dueDate: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.format': 'Due date must be in ISO 8601 format',
      'date.min': 'Due date cannot be in the past',
    }),
});

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .optional()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title cannot exceed 200 characters',
    }),
  description: Joi.string()
    .max(2000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 2000 characters',
    }),
  status: Joi.string()
    .valid('not_started', 'in_progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: not_started, in_progress, completed',
    }),
  priority: Joi.string()
    .valid('none', 'low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority must be one of: none, low, medium, high',
    }),
  assigneeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid assignee ID format',
    }),
  dueDate: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      'date.format': 'Due date must be in ISO 8601 format',
    }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('not_started', 'in_progress', 'completed')
    .required()
    .messages({
      'any.only': 'Status must be one of: not_started, in_progress, completed',
      'any.required': 'Status is required',
    }),
});

const updatePrioritySchema = Joi.object({
  priority: Joi.string()
    .valid('none', 'low', 'medium', 'high')
    .required()
    .messages({
      'any.only': 'Priority must be one of: none, low, medium, high',
      'any.required': 'Priority is required',
    }),
});

const reorderTasksSchema = Joi.object({
  newStatus: Joi.string()
    .valid('not_started', 'in_progress', 'completed')
    .required()
    .messages({
      'any.only': 'New status must be one of: not_started, in_progress, completed',
      'any.required': 'New status is required',
    }),
  newOrder: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'New order must be a number',
      'number.integer': 'New order must be an integer',
      'number.min': 'New order must be non-negative',
      'any.required': 'New order is required',
    }),
});

const assignTaskSchema = Joi.object({
  assigneeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid assignee ID format',
      'any.required': 'Assignee ID is required',
    }),
});

const getProjectTasksQuerySchema = Joi.object({
  status: Joi.string()
    .valid('not_started', 'in_progress', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: not_started, in_progress, completed',
    }),
  priority: Joi.string()
    .valid('none', 'low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority must be one of: none, low, medium, high',
    }),
  assigneeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid assignee ID format',
    }),
});

module.exports = {
  taskIdParamSchema,
  projectIdParamSchema,
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  updatePrioritySchema,
  reorderTasksSchema,
  assignTaskSchema,
  getProjectTasksQuerySchema,
};
