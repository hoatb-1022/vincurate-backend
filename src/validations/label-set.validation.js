const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLabelSet = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    labels: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const getLabelSet = {
  params: Joi.object().keys({
    labelSetId: Joi.string().custom(objectId),
  }),
};

const updateLabelSet = {
  params: Joi.object().keys({
    labelSetId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      labels: Joi.array().items(Joi.string().custom(objectId)),
    })
    .min(1),
};

const deleteLabelSet = {
  params: Joi.object().keys({
    labelSetId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getLabelSet,
  createLabelSet,
  updateLabelSet,
  deleteLabelSet,
};
