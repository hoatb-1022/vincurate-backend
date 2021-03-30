const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { articleService } = require('../services');

const getArticles = catchAsync(async (req, res) => {
  const result = await articleService.queryArticles(req);
  res.send(result);
});

const uploadFile = catchAsync(async (req, res) => {
  const {
    files,
    body: { method, projectId },
    user,
  } = req;
  const article = await articleService.uploadFile(user, projectId, files, method);
  res.status(httpStatus.CREATED).send(article);
});

const createArticle = catchAsync(async (req, res) => {
  const article = await articleService.createArticle(req.user, req.body);
  res.status(httpStatus.CREATED).send(article);
});

const getArticle = catchAsync(async (req, res) => {
  const article = await articleService.getArticleById(req.params.articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  res.send(article);
});

const updateArticle = catchAsync(async (req, res) => {
  const article = await articleService.updateArticleById(req.params.articleId, req.body);
  res.send(article);
});

const exportArticle = catchAsync(async (req, res) => {
  const {
    params: { articleId },
    query: { method },
  } = req;
  const { fileName, data, contentType } = await articleService.exportArticleById(articleId, method);
  res.status(httpStatus.CREATED).header('Content-Type', contentType).attachment(fileName).send(data);
});

const getNextArticle = catchAsync(async (req, res) => {
  const article = await articleService.getNextArticleById(req.params.articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Next article not found');
  }
  res.send(article);
});

const deleteArticle = catchAsync(async (req, res) => {
  await articleService.deleteArticleById(req.params.articleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateArticleAnnotations = catchAsync(async (req, res) => {
  const {
    user,
    body,
    params: { articleId },
  } = req;
  const article = await articleService.updateArticleAnnotationsById(user, articleId, body);
  res.send(article);
});

const createArticleSeqLabelVersion = catchAsync(async (req, res) => {
  const {
    params: { articleId },
    body,
    user,
  } = req;
  const article = await articleService.createArticleSeqLabelVersionById(articleId, user, body);
  res.send(article);
});

const createArticleCategoryVersion = catchAsync(async (req, res) => {
  const {
    params: { articleId },
    body,
    user,
  } = req;
  const article = await articleService.createArticleCategoryVersionById(articleId, user, body);
  res.send(article);
});

module.exports = {
  getArticles,
  uploadFile,
  getArticle,
  updateArticle,
  exportArticle,
  createArticle,
  getNextArticle,
  deleteArticle,
  updateArticleAnnotations,
  createArticleSeqLabelVersion,
  createArticleCategoryVersion
};
