const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { toJSON, paginate } = require('./plugins');
const User = require('./user.model');
const Annotation = require('./annotation.model');
const { elasticClient } = require('../config/config');

const articleSchema = mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      es_select: '_id name email',
    },
    content: { type: String, default: '' },
    annotations: [Annotation.schema],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    editVersions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EditVersion',
      },
    ],
    lastCurator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      es_select: '_id name email',
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.plugin(toJSON);
articleSchema.plugin(paginate);

articleSchema.plugin(mongoosastic, {
  esClient: elasticClient,
  populate: [
    {
      path: 'user',
      model: 'User',
      schema: User.schema,
      select: '_id name email',
    },
  ],
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
