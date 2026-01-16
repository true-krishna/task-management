const Joi = require('joi');

/**
 * Validator for updating user profile
 */
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).trim().messages({
    'string.base': 'First name must be a string',
    'string.min': 'First name must be at least 1 character',
    'string.max': 'First name must not exceed 50 characters',
  }),
  lastName: Joi.string().min(1).max(50).trim().messages({
    'string.base': 'Last name must be a string',
    'string.min': 'Last name must be at least 1 character',
    'string.max': 'Last name must not exceed 50 characters',
  }),
  avatar: Joi.string().uri().trim().allow('', null).messages({
    'string.uri': 'Avatar must be a valid URL',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * Validator for updating user role
 */
const updateRoleSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required().messages({
    'any.required': 'Role is required',
    'string.base': 'Role must be a string',
    'any.only': 'Role must be either "user" or "admin"',
  }),
});

/**
 * Validator for user ID parameter
 */
const userIdParamSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'User ID is required',
    'string.base': 'User ID must be a string',
  }),
});

/**
 * Validator for get all users query parameters
 */
const getAllUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(50).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100',
  }),
  role: Joi.string().valid('user', 'admin').messages({
    'string.base': 'Role must be a string',
    'any.only': 'Role must be either "user" or "admin"',
  }),
  isActive: Joi.boolean().messages({
    'boolean.base': 'isActive must be a boolean',
  }),
});

module.exports = {
  updateProfileSchema,
  updateRoleSchema,
  userIdParamSchema,
  getAllUsersQuerySchema,
};
