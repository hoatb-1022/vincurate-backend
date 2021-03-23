const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { projectRoles } = require('../config/projects');

const projectRoleSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: [projectRoles.ANNOTATOR, projectRoles.APPROVER, projectRoles.PROJECT_ADMIN],
      default: projectRoles.ANNOTATOR,
    },
  },
  {
    timestamps: true,
  }
);

projectRoleSchema.plugin(toJSON);
projectRoleSchema.plugin(paginate);

const ProjectRole = mongoose.model('ProjectRole', projectRoleSchema);

module.exports = ProjectRole;
