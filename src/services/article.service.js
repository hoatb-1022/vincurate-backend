const httpStatus = require('http-status');
const { Article } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService } = require('.');

const queryArticles = async ({ query: { q, per, page, order } }) => {
  const query = !q || !q.length ? '*' : q;
  const size = per || 15;
  const from = (page - 1) * size || 0;
  const sort = [{ createdAt: { order } }];
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

const uploadFile = async (files, source, userId) => {
  if (!files) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No file uploaded');
  }

  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { article } = files;
  const newUnits = await Article.unitsFromFile(article);
  const newArticle = new Article({
    source,
    description: Article.getArticlesShortDesc(newUnits),
    units: newUnits,
    user: userId,
  });
  user.articles.push(newArticle.id);
  newUnits.forEach((unit) => {
    // eslint-disable-next-line no-param-reassign
    unit.article = newArticle.id;
  });

  await user.save();
  await newArticle.save();
  await newUnits.map((unit) => unit.save());

  return newArticle;
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
  exportArticleById,
  deleteArticleById,
  getNextArticleById,
};
