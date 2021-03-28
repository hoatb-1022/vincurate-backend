const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { labelTypes } = require('../config/articles');

const labelSchema = mongoose.Schema(
  {
    value: { type: String, required: true, trim: true },
    name: { type: String, default: '' },
    shortcut: { type: String, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, required: true, trim: true, default: '#2b2b2b' },
    type: {
      type: String,
      required: true,
      enum: [labelTypes.CONCEPT, labelTypes.CATEGORY, labelTypes.TRANSLATION],
      default: labelTypes.CONCEPT,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

labelSchema.plugin(toJSON);
labelSchema.plugin(paginate);

labelSchema.statics.bioConceptLabelsData = function () {
  return [
    {
      value: 'DIS',
      name: 'Disease',
      color: '#e97001',
      icon: 'mdi mdi-virus',
    },
    {
      value: 'CHE',
      name: 'Chemical',
      color: '#2dba4c',
      icon: 'mdi mdi-flask',
    },
    {
      value: 'TRM',
      name: 'Treatment',
      color: '#21accb',
      icon: 'mdi mdi-pill',
    },
    {
      value: 'MISC',
      name: 'Miscellaneous',
      color: '#dd0964',
      icon: 'mdi mdi-frequently-asked-questions',
    },
    {
      value: 'ORG',
      name: 'Organization',
      color: '#120670',
      icon: 'mdi mdi-city-variant',
    },
    {
      value: 'PER',
      name: 'Person',
      color: '#9f5ab1',
      icon: 'mdi mdi-account',
    },
    {
      value: 'LOC',
      name: 'Location',
      color: '#e0a904',
      icon: 'mdi mdi-map-marker',
    },
  ];
};

const Label = mongoose.model('Label', labelSchema);

module.exports = Label;
