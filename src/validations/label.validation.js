const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLabel = {
  body: Joi.object().keys({
    value: Joi.string().required(),
    name: Joi.string().allow(''),
    shortcut: Joi.string().allow(''),
    icon: Joi.string().allow(''),
    color: Joi.string(),
  }),
};

const getLabel = {
  params: Joi.object().keys({
    labelId: Joi.string().custom(objectId),
  }),
};

const updateLabel = {
  params: Joi.object().keys({
    labelId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().allow(''),
      shortcut: Joi.string().allow(''),
      icon: Joi.string().allow(''),
      color: Joi.string(),
    })
    .min(1),
};

const deleteLabel = {
  params: Joi.object().keys({
    labelId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getLabel,
  createLabel,
  updateLabel,
  deleteLabel,
};
