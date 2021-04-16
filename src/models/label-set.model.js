const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Label = require('./label.model');

const labelSetSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

labelSetSchema.plugin(toJSON);
labelSetSchema.plugin(paginate);

const LabelSet = mongoose.model('LabelSet', labelSetSchema);

module.exports = LabelSet;
