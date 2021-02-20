const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const unitSchema = mongoose.Schema(
  {
    senIndex: { type: String, required: true, trim: true, default: '' },
    word: { type: String, required: true, trim: true, default: '' },
    posTag: { type: String, required: true, trim: true, default: '' },
    label: { type: String, required: true, trim: true, default: '' },
    parentNode: { type: String, required: true, trim: true, default: '' },
    depRelation: { type: String, required: true, trim: true, default: '' },
  },
  {
    timestamps: true,
  }
);

unitSchema.plugin(toJSON);
unitSchema.plugin(paginate);

unitSchema.pre('validate', function handle(next) {
  this.word = this.word && this.word.length ? this.word : ' ';
  this.label = this.label && this.label.length ? this.label : ' ';
  next();
});

/**
 * @typedef User
 */
const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
