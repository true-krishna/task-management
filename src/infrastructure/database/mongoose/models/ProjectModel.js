/**
 * Project Mongoose Model
 */
const mongoose = require('mongoose');
const ProjectSchema = require('../schemas/ProjectSchema');

const ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = ProjectModel;
