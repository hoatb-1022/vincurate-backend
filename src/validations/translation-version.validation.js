const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTranslationVersion = {
  params: Joi.object().keys({
    articleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      translation: Joi.object(),
    })
    .min(1),
};

const getTranslationVersion = {
  params: Joi.object().keys({
    translationVerId: Joi.string().custom(objectId),
  }),
};

const updateTranslationVersion = {
  params: Joi.object().keys({
    translationVerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    translation: Joi.object().required(),
  }),
};

const applyTranslationVersion = {
  params: Joi.object().keys({
    translationVerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    lastApprover: Joi.string().custom(objectId),
    translation: Joi.object().required(),
  }),
};

module.exports = {
  createTranslationVersion,
  getTranslationVersion,
  updateTranslationVersion,
  applyTranslationVersion,
};
