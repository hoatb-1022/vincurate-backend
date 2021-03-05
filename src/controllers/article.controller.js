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
    body: { source, userId },
  } = req;
  const article = await articleService.uploadFile(files, source, userId);
  res.status(httpStatus.CREATED).send(article);
});

const getArticle = catchAsync(async (req, res) => {
  const article = await articleService.getArticleById(req.params.articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  res.send(article);
});

const exportArticle = catchAsync(async (req, res) => {
  const { fileName, data } = await articleService.exportArticleById(req.params.articleId);
  res.status(httpStatus.CREATED).header('Content-Type', 'text/csv').attachment(fileName).send(data);
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

module.exports = {
  getArticles,
  uploadFile,
  getArticle,
  exportArticle,
  getNextArticle,
  deleteArticle,
};
