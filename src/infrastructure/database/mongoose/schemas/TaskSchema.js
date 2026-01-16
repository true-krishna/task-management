/**
 * Task Mongoose Schema
 */
const { Schema } = require('mongoose');
const TaskStatus = require('../../../../domain/enums/TaskStatus');
const TaskPriority = require('../../../../domain/enums/TaskPriority');

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.NOT_STARTED,
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.NONE,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    order: {
      type: Number,
      default: 0,
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
TaskSchema.index({ projectId: 1, status: 1 });
TaskSchema.index({ projectId: 1, status: 1, order: 1 });
TaskSchema.index({ assigneeId: 1 });
TaskSchema.index({ createdAt: -1 });
TaskSchema.index({ dueDate: 1 });

module.exports = TaskSchema;
