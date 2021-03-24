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

module.exports = {
  createEditVersion,
  getEditVersion,
};
