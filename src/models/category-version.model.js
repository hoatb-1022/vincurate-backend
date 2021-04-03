const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Category = require('./category.model');
const { versionStatuses } = require('../config/articles');

const categoryVersionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
    categories: [Category.schema],
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

categoryVersionSchema.plugin(toJSON);
categoryVersionSchema.plugin(paginate);

const CategoryVersion = mongoose.model('CategoryVersion', categoryVersionSchema);

module.exports = CategoryVersion;
