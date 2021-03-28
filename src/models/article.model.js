const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { toJSON, paginate } = require('./plugins');
const User = require('./user.model');
const Annotation = require('./annotation.model');
const { elasticClient } = require('../config/config');

const articleSchema = mongoose.Schema(
  {
    title: { type: String, default: '', es_indexed: true },
    description: { type: String, default: '', es_indexed: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      es_indexed: true,
      es_select: '_id name email',
    },
    content: { type: String, default: '', es_indexed: true },
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
    createdAt: { type: Date, es_type: 'date', es_indexed: true },
    updatedAt: { type: Date, es_type: 'date', es_indexed: true },
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
