const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSeqLabelVersion = {
  params: Joi.object().keys({
    articleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      annotations: Joi.array().items(Joi.object()),
    })
    .min(1),
};

const getSeqLabelVersion = {
  params: Joi.object().keys({
    seqLabelVerId: Joi.string().custom(objectId),
  }),
};

const updateSeqLabelVersion = {
  params: Joi.object().keys({
    seqLabelVerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    annotations: Joi.array().items(Joi.object()).required(),
  }),
};

const applySeqLabelVersion = {
  params: Joi.object().keys({
    seqLabelVerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    lastApprover: Joi.string().custom(objectId),
    annotations: Joi.array().items(Joi.object()).required(),
  }),
};

module.exports = {
  createSeqLabelVersion,
  getSeqLabelVersion,
  updateSeqLabelVersion,
  applySeqLabelVersion,
};
