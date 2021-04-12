const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const translationSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

translationSchema.plugin(toJSON);
translationSchema.plugin(paginate);

const Translation = mongoose.model('Translation', translationSchema);

module.exports = Translation;
