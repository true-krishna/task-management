/**
 * Project Mongoose Schema
 */
const { Schema } = require('mongoose');
const ProjectStatus = require('../../../../domain/enums/ProjectStatus');
const ProjectVisibility = require('../../../../domain/enums/ProjectVisibility');

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
      required: true,
    },
    visibility: {
      type: String,
      enum: Object.values(ProjectVisibility),
      default: ProjectVisibility.PRIVATE,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
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
ProjectSchema.index({ ownerId: 1 });
ProjectSchema.index({ members: 1 });
ProjectSchema.index({ visibility: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ visibility: 1, status: 1 });
ProjectSchema.index({ createdAt: -1 });

module.exports = ProjectSchema;
