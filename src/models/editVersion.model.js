const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Annotation = require('./annotation.model');

const editVersionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
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

editVersionSchema.plugin(toJSON);
editVersionSchema.plugin(paginate);

const EditVersion = mongoose.model('EditVersion', editVersionSchema);

module.exports = EditVersion;
