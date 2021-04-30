const httpStatus = require('http-status');
const { Article, SeqLabelVersion, CategoryVersion, TranslationVersion, User, Project } = require('../models');
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
  const { article, labels, categories } = await articleHelper.importArticleFromFile(user, project, file, method);
  project.articles.push(article);

  await article.save();
  await user.save();
  await project.save();
  await labels.map((label) => label.save());
  await categories.map((category) => category.save());

  return article;
};

const getArticleById = async (id) => {
  const article = await Article.findById(id).populate([
    'user',
    'project',
    'project.owner',
    'seqLabelVersions',
    'categoryVersions',
    'translationVersions',
    'lastCurator',
  ]);

  // eslint-disable-next-line no-restricted-syntax,no-await-in-loop
  for (const sl of article.seqLabelVersions) sl.user = await User.findById(sl.user);
  // eslint-disable-next-line no-restricted-syntax,no-await-in-loop
  for (const c of article.categoryVersions) c.user = await User.findById(c.user);
  // eslint-disable-next-line no-restricted-syntax,no-await-in-loop
  for (const t of article.translationVersions) t.user = await User.findById(t.user);
  article.project.owner = await User.findById(article.project.owner);

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
  importerHelper.generateArticleDescription(article);

  project.articles.push(article.id);
  await project.save();

  return article;
};

const deleteArticleById = async (articleId) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  const project = await Project.findById(article.project.id);
  if (project) {
    const index = project.articles.findIndex((a) => a.toString() === article.id);
    if (index >= 0) project.articles.splice(index, 1);
  }

  await article.remove();
  await project.save();

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

const updateArticleCategoriesById = async (user, articleId, { categories }) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  article.categories = categories;

  await article.save();
  return article;
};

const updateArticleTranslationById = async (user, articleId, { translation }) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  article.translation = translation;

  await article.save();
  return article;
};

const createArticleSeqLabelVersionById = async (articleId, user, { annotations }) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  const seqLabelVersion = new SeqLabelVersion();
  seqLabelVersion.user = user.id;
  seqLabelVersion.article = article.id;
  seqLabelVersion.annotations = annotations;
  article.seqLabelVersions.push(seqLabelVersion.id);

  await seqLabelVersion.save();
  await article.save();
  return article;
};

const createArticleCategoryVersionById = async (articleId, user, { categories }) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  const categoryVersion = new CategoryVersion();
  categoryVersion.user = user.id;
  categoryVersion.article = article.id;
  categoryVersion.categories = categories;
  article.categoryVersions.push(categoryVersion.id);

  await categoryVersion.save();
  await article.save();
  return article;
};

const createArticleTranslationVersionById = async (articleId, user, { translation }) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }

  const translationVersion = new TranslationVersion();
  translationVersion.user = user.id;
  translationVersion.article = article.id;
  translationVersion.translation = translation;
  article.translationVersions.push(translationVersion.id);

  await translationVersion.save();
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
  updateArticleCategoriesById,
  updateArticleTranslationById,
  createArticleSeqLabelVersionById,
  createArticleCategoryVersionById,
  createArticleTranslationVersionById,
};
