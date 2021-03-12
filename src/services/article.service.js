const httpStatus = require('http-status');
const { Article } = require('../models');
const { articleHelper } = require('../utils/helpers');
const ApiError = require('../utils/ApiError');

const queryArticles = async ({ query: { q, per, page, order } }) => {
  const query = !q || !q.length ? '*' : q;
  const size = per || 15;
  const from = (page - 1) * size || 0;
  const _order = order || 'desc';
  const sort = [{ createdAt: { order: _order } }];
  const searchOptions = {
    query_string: {
      query,
    },
  };

  return new Promise((resolve, reject) => {
    Article.search(searchOptions, { sort, from, size }, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const uploadFile = async (user, files, method) => {
  if (!files) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No file uploaded');
  }

  const { file } = files;
  const { article, units, annotations, labels } = await articleHelper.importArticleFromFile(user, file, method);
  user.articles.push(article);

  await article.save();
  await user.save();
  await units.map((unit) => unit.save());
  await annotations.map((anno) => anno.save());
  await labels.map((label) => label.save());

  return article;
};

const getArticleById = async (id) => {
  return Article.findById(id).populate('user');
};

const exportArticleById = async (articleId) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  const fileName = `${article._id}_tokens.csv`;
  const data = article.csvUnitsData();

  return { fileName, data };
};

const deleteArticleById = async (articleId) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  await article.remove();
  return article;
};

const updateArticleById = async (articleId, updateBody) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  Object.assign(article, updateBody);
  await article.save();
  return article;
};

const getNextArticleById = async (id) => {
  const article = await getArticleById(id);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  return Article.findOne({ createdAt: { $lt: article.createdAt } }).sort({ createdAt: -1 });
};

module.exports = {
  queryArticles,
  uploadFile,
  getArticleById,
  updateArticleById,
  exportArticleById,
  deleteArticleById,
  getNextArticleById,
};
