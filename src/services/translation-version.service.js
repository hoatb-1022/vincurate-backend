const httpStatus = require('http-status');
const { TranslationVersion, User, Article } = require('../models');
const ApiError = require('../utils/ApiError');
const { versionStatuses } = require('../config/articles');

const getTranslationVersionById = async (id) => {
  const translationVersion = await TranslationVersion.findById(id).populate(['user', 'article', 'lastApprover']);
  translationVersion.article.lastCurator = await User.findById(translationVersion.article.lastCurator);
  return translationVersion;
};

const updateTranslationVersionById = async (translationVerId, updateBody) => {
  const translationVersion = await getTranslationVersionById(translationVerId);
  if (!translationVersion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Translation not found');
  }

  Object.assign(translationVersion, updateBody);
  await translationVersion.save();
  return translationVersion;
};

const applyTranslationVersionById = async (translationVerId, user, { translation, status }) => {
  const translationVersion = await getTranslationVersionById(translationVerId);
  if (!translationVersion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Translation not found');
  }

  if (status) {
    switch (status) {
      case versionStatuses.DECLINED:
        translationVersion.lastApprover = user;
        break;
      case versionStatuses.APPROVED:
      case versionStatuses.MERGED:
        {
          const article = await Article.findById(translationVersion.article.id);
          article.translation = translation;
          await article.save();
        }

        translationVersion.lastApprover = user;
        break;
      default:
        break;
    }
  }

  translationVersion.status = status;
  await translationVersion.save();
  return translationVersion;
};

module.exports = {
  getTranslationVersionById,
  updateTranslationVersionById,
  applyTranslationVersionById,
};
