const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const { toJSON, paginate } = require('./plugins');
const ProjectRole = require('./project-role.model');
const { projectTypes } = require('../config/projects');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    roles: [ProjectRole.schema],
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    type: {
      type: String,
      enum: [projectTypes.SEQ_2_SEQ, projectTypes.SEQ_LABEL, projectTypes.DOC_CLASS],
      default: projectTypes.SEQ_LABEL,
    },
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
      },
    ],
  },
  {
    timestamps: true,
  }
);

projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);
projectSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
