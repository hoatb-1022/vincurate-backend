const httpStatus = require('http-status');
const { Article, EditVersion, User } = require('../models');
const { articleHelper } = require('../utils/helpers');
const ApiError = require('../utils/ApiError');
const projectService = require('./project.service');
const importerHelper = require('../utils/helpers/importer.helper');

const queryArticles = async ({ query: { q, fields, per, page, order } }) => {
  const query = !q || !q.length ? '*' : q;
  const size = per || 15;
  const from = (page - 1) * size || 0;
  const _order = order || 'desc';
  const _fields = fields ? fields.split(',') : ['*'];
  const sort = [{ createdAt: { order: _order } }];
  const searchOptions = {
    query_string: {
      fields: _fields,
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

const uploadFile = async (user, projectId, files, method) => {
  if (!files) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No file uploaded');
  }

  const project = await projectService.getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const { file } = files;
  const { article, labels } = await articleHelper.importArticleFromFile(user, project, file, method);
  project.articles.push(article);

  await article.save();
  await user.save();
  await project.save();
  await labels.map((label) => label.save());

  return article;
};

const getArticleById = async (id) => {
  const article = await Article.findById(id).populate(['user', 'project', 'editVersions', 'lastCurator']);

  // eslint-disable-next-line no-restricted-syntax,no-await-in-loop
  for (const ev of article.editVersions) ev.user = await User.findById(ev.user);

  return article;
};

const exportArticleById = async (articleId, method) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  const { data, contentType, suffix } = await articleHelper.exportArticleInFile(article, method);
  const fileName = `${article._id}_tokens.${suffix}`;

  return { fileName, data, contentType };
};

const createArticle = async (user, articleBody) => {
  const project = await projectService.getProjectById(articleBody.projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const article = await Article.create({
    user,
    project,
    ...articleBody,
  });

  project.articles.push(article.id);
  await project.save();

  return article;
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
  if (updateBody.content) article.description = importerHelper.generateArticleDescription(article);

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

const updateArticleAnnotationsById = async (user, articleId, { annotations }) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  article.annotations = annotations;
  article.description = importerHelper.generateArticleDescription(article);

  await article.save();
  return article;
};

const createArticleEditVersionById = async (articleId, user, { annotations }) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  const editVersion = new EditVersion();
  editVersion.user = user.id;
  editVersion.article = article.id;
  editVersion.annotations = annotations;
  article.editVersions.push(editVersion.id);

  await editVersion.save();
  await article.save();
  return article;
};

module.exports = {
  queryArticles,
  uploadFile,
  getArticleById,
  updateArticleById,
  exportArticleById,
  createArticle,
  deleteArticleById,
  getNextArticleById,
  updateArticleAnnotationsById,
  createArticleEditVersionById,
};
