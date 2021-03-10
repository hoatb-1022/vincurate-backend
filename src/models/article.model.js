const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const neatCsv = require('neat-csv');
const { Parser } = require('json2csv');
const { toJSON, paginate } = require('./plugins');
const User = require('./user.model');
const Unit = require('./unit.model');
const { elasticClient } = require('../config/config');

const articleSchema = mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    source: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['News', 'Others'],
      default: 'News',
    },
    visibility: {
      type: String,
      required: true,
      enum: ['Personal', 'Stakeholders', 'Community'],
      default: 'Personal',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    description: { type: String, required: true, trim: true, default: '' },
    units: {
      type: [Unit.schema],
      ref: 'Unit',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      es_select: '_id name email',
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.plugin(toJSON);
articleSchema.plugin(paginate);

articleSchema.plugin(mongoosastic, {
  esClient: elasticClient,
  populate: [
    {
      path: 'user',
      model: 'User',
      schema: User.schema,
      select: '_id name email',
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

articleSchema.statics.getArticlesShortDesc = function (tokens) {
  const noBeforeSpaceCharacters = ['.', ',', ':', ')', '}', ']', '"', "'", ';'];
  const noAfterSpaceCharacters = ['(', '[', '{', '"', "'"];
  let result = '';
  let currentType = 'O';

  tokens.slice(0, 65).forEach((token, index) => {
    let after = ' ';
    if (
      index === tokens.length - 1 ||
      noBeforeSpaceCharacters.includes(this.getUnitConcept(tokens[index + 1])) ||
      noAfterSpaceCharacters.includes(this.getUnitConcept(token))
    )
      after = '';

    let before = ' ';
    if (
      index === 0 ||
      noAfterSpaceCharacters.includes(this.getUnitConcept(tokens[index - 1])) ||
      noBeforeSpaceCharacters.includes(this.getUnitConcept(token))
    )
      before = '';

    const conceptType = this.getUnitConcept(token);
    let nextAdd = '';
    if (conceptType.startsWith('B') || conceptType !== currentType) {
      if (currentType !== 'O') {
        if (conceptType === 'O') {
          result = result.trim();
          nextAdd = `</span>${before}${token.word}${after}`;
        } else {
          result = result.trim();
          nextAdd = `</span>${before}<span class="concept-${conceptType}-text">${token.word}${after}`;
        }
      } else {
        nextAdd = `<span class="concept-${conceptType}-text">${token.word}${after}`;
      }

      currentType = conceptType;
    } else {
      nextAdd = `${token.word}${after}`;
    }

    result += nextAdd;
  });
  result = `${result.trim()}...`;

  return result;
};

articleSchema.methods.csvUnitsData = function () {
  const article = this;
  const fields = Object.keys(Unit.schema.obj);
  const opts = {
    fields,
    header: false,
  };
  const units = article.units.map((t) => ({
    senIndex: t.senIndex,
    word: t.word,
    posTag: t.posTag,
    label: t.label,
    parentNode: t.parentNode,
    depRelation: t.depRelation,
  }));
  const parser = new Parser(opts);
  return parser.parse(units);
};

/**
 * @typedef User
 */
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
