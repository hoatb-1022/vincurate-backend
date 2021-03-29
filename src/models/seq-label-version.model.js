const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Annotation = require('./annotation.model');
const { seqLabelVersionStatuses } = require('../config/articles');

const seqLabelVersionSchema = mongoose.Schema(
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
    status: {
      type: String,
      enum: Object.values(seqLabelVersionStatuses),
      default: seqLabelVersionStatuses.PENDING,
    },
    lastApprover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

seqLabelVersionSchema.plugin(toJSON);
seqLabelVersionSchema.plugin(paginate);

const SeqLabelVersion = mongoose.model('SeqLabelVersion', seqLabelVersionSchema);

module.exports = SeqLabelVersion;
