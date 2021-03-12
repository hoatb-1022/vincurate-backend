const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Label = require('./label.model');

const annotationSchema = mongoose.Schema(
  {
    offsetStart: { type: Number },
    offsetEnd: { type: Number },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
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
