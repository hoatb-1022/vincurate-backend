const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const labelSchema = mongoose.Schema(
  {
    value: { type: String, required: true, trim: true, default: '' },
    color: { type: String, required: true, trim: true, default: '#000000' },
    type: { type: String, required: true, enum: ['common', 'category'], default: 'common' },
  },
  {
    timestamps: true,
  }
);

labelSchema.plugin(toJSON);
labelSchema.plugin(paginate);

const Label = mongoose.model('Label', labelSchema);

module.exports = Label;
