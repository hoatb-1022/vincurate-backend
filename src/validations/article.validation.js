const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getArticles = {
  query: Joi.object().keys({
    q: Joi.string(),
    order: Joi.string(),
    per: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const uploadFile = {
  payload: Joi.object().keys({
    file: Joi.binary().required(),
    filename: Joi.string(),
  }),
  body: Joi.object().keys({
    source: Joi.string(),
  }),
};

const getArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().custom(objectId),
  }),
};

const deleteArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  uploadFile,
  getArticle,
  getArticles,
  deleteArticle,
};
