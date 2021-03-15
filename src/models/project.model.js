const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const ProjectRole = require('./projectRole.model');
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
  },
  {
    timestamps: true,
  }
);

projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
