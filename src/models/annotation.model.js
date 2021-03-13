const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Label = require('./label.model');

const annotationSchema = mongoose.Schema(
  {
    offsetInArticle: { type: Number },
    offsetStart: { type: Number },
    offsetEnd: { type: Number },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    label: Label.schema,
  },
  {
    timestamps: true,
  }
);

annotationSchema.plugin(toJSON);
annotationSchema.plugin(paginate);

const Annotation = mongoose.model('Annotation', annotationSchema);

module.exports = Annotation;
