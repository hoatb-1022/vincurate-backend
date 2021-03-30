const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategoryVersion = {
  params: Joi.object().keys({
    articleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      categories: Joi.array().items(Joi.object()),
    })
    .min(1),
};

const getCategoryVersion = {
  params: Joi.object().keys({
    categoryVerId: Joi.string().custom(objectId),
  }),
};

const updateCategoryVersion = {
  params: Joi.object().keys({
    categoryVerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    categories: Joi.array().items(Joi.object()).required(),
  }),
};

const applyCategoryVersion = {
  params: Joi.object().keys({
    categoryVerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    lastApprover: Joi.string().custom(objectId),
    categories: Joi.array().items(Joi.object()).required(),
  }),
};

module.exports = {
  createCategoryVersion,
  getCategoryVersion,
  updateCategoryVersion,
  applyCategoryVersion,
};
