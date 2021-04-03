const httpStatus = require('http-status');
const { CategoryVersion, User, Article } = require('../models');
const ApiError = require('../utils/ApiError');
const { versionStatuses } = require('../config/articles');

const getCategoryVersionById = async (id) => {
  const categoryVersion = await CategoryVersion.findById(id).populate(['user', 'article', 'lastApprover']);
  categoryVersion.article.lastCurator = await User.findById(categoryVersion.article.lastCurator);
  return categoryVersion;
};

const updateCategoryVersionById = async (categoryVerId, updateBody) => {
  const categoryVersion = await getCategoryVersionById(categoryVerId);
  if (!categoryVersion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  Object.assign(categoryVersion, updateBody);
  await categoryVersion.save();
  return categoryVersion;
};

const applyCategoryVersionById = async (categoryVerId, user, { categories, status }) => {
  const categoryVersion = await getCategoryVersionById(categoryVerId);
  if (!categoryVersion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  if (status) {
    switch (status) {
      case versionStatuses.DECLINED:
        categoryVersion.lastApprover = user;
        break;
      case versionStatuses.APPROVED:
      case versionStatuses.MERGED:
        {
          const article = await Article.findById(categoryVersion.article.id);
          article.categories = categories;
          await article.save();
        }

        categoryVersion.lastApprover = user;
        break;
      default:
        break;
    }
  }

  categoryVersion.status = status;
  await categoryVersion.save();
  return categoryVersion;
};

module.exports = {
  getCategoryVersionById,
  updateCategoryVersionById,
  applyCategoryVersionById,
};
