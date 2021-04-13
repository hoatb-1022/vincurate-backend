const mongoose = require('mongoose');
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
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    types: [
      {
        type: String,
        enum: Object.values(projectTypes),
      },
    ],
  },
  {
    timestamps: true,
  }
);

projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
