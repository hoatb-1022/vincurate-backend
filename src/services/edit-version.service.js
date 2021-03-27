const httpStatus = require('http-status');
const { EditVersion, User, Article } = require('../models');
const ApiError = require('../utils/ApiError');
const { editVersionStatuses } = require('../config/articles');

const getEditVersionById = async (id) => {
  const editVersion = await EditVersion.findById(id).populate(['user', 'article', 'lastApprover']);
  editVersion.article.lastCurator = await User.findById(editVersion.article.lastCurator);
  return editVersion;
};

const updateEditVersionById = async (editVerId, updateBody) => {
  const editVersion = await getEditVersionById(editVerId);
  if (!editVersion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Edit version not found');
  }

  Object.assign(editVersion, updateBody);
  await editVersion.save();
  return editVersion;
};

const applyEditVersionById = async (editVerId, user, { annotations, status }) => {
  const editVersion = await getEditVersionById(editVerId);
  if (!editVersion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Edit version not found');
  }

  if (status) {
    switch (status) {
      case editVersionStatuses.DECLINED:
        editVersion.lastApprover = user;
        break;
      case editVersionStatuses.APPROVED:
      case editVersionStatuses.MERGED:
        {
          const article = await Article.findById(editVersion.article.id);
          article.annotations = annotations;
          await article.save();
        }

        editVersion.lastApprover = user;
        break;
      default:
        break;
    }
  }

  editVersion.status = status;
  await editVersion.save();
  return editVersion;
};

module.exports = {
  getEditVersionById,
  updateEditVersionById,
  applyEditVersionById,
};
