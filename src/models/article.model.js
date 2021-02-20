const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const neatCsv = require('neat-csv');
const { toJSON, paginate } = require('./plugins');
const User = require('./user.model');
const Unit = require('./unit.model');

const articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true, default: '' },
    source: { type: String, required: true, trim: true, default: '' },
    category: { type: String, required: true, trim: true, default: 'News' },
    description: { type: String, required: true, trim: true, default: '' },
    units: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
      },
    ],
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.plugin(toJSON);
articleSchema.plugin(paginate);
articleSchema.plugin(mongoosastic, {
  populate: [
    {
      path: 'uploader',
      model: 'User',
      schema: User.schema,
      select: '_id username fullName',
    },
  ],
});

articleSchema.statics.unitsFromFile = async function (file) {
  const rawUnitData = file.data.toString('utf-8');
  const parsedUnitData = await neatCsv(rawUnitData, {
    headers: Object.keys(Unit.schema.obj),
  });
  const units = [];

  parsedUnitData.forEach((unitData) => {
    if (unitData.word) {
      const regex = /(.+)_(.+)/g;
      while (unitData.word.match(regex)) {
        // eslint-disable-next-line no-param-reassign
        unitData.word = unitData.word.replace(regex, '$1 $2').trim();
      }
    }

    units.push(new Unit(unitData));
  });

  return units;
};

articleSchema.statics.formatUnitWord = function (unit) {
  if (!unit || !unit.word || !unit.word.length) return '';

  return unescape(unit.word.trim());
};

articleSchema.statics.getUnitConcept = function (unit) {
  let { label } = unit;
  const splitIndex = label.indexOf('-');
  if (splitIndex >= 0) label = label.substring(splitIndex + 1);

  if (!label || !label.length) label = 'O';

  return label;
};

/**
 * @typedef User
 */
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
