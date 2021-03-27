const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createEditVersion = {
  params: Joi.object().keys({
    articleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      annotations: Joi.array().items(Joi.object()),
    })
    .min(1),
};

const getEditVersion = {
  params: Joi.object().keys({
    editVerId: Joi.string().custom(objectId),
  }),
};

const updateEditVersion = {
  params: Joi.object().keys({
    editVerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    annotations: Joi.array().items(Joi.object()).required(),
  }),
};

const applyEditVersion = {
  params: Joi.object().keys({
    editVerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    lastApprover: Joi.string().custom(objectId),
    annotations: Joi.array().items(Joi.object()).required(),
  }),
};

module.exports = {
  createEditVersion,
  getEditVersion,
  updateEditVersion,
  applyEditVersion,
};
