/**
 * Task Mongoose Model
 */
const mongoose = require('mongoose');
const TaskSchema = require('../schemas/TaskSchema');

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
