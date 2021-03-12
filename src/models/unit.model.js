const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Annotation = require('./annotation.model');

const unitSchema = mongoose.Schema(
  {
    text: { type: String, required: true, default: '' },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
    annotations: [Annotation.schema],
  },
  {
    timestamps: true,
  }
);

unitSchema.plugin(toJSON);
unitSchema.plugin(paginate);

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
