const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Translation = require('./translation.model');
const { versionStatuses } = require('../config/articles');

const translationVersionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
    translation: Translation.schema,
    status: {
      type: String,
      enum: Object.values(versionStatuses),
      default: versionStatuses.PENDING,
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

translationVersionSchema.plugin(toJSON);
translationVersionSchema.plugin(paginate);

const TranslationVersion = mongoose.model('TranslationVersion', translationVersionSchema);

module.exports = TranslationVersion;
