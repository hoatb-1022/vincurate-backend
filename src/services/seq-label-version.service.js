const httpStatus = require('http-status');
const { SeqLabelVersion, User, Article } = require('../models');
const ApiError = require('../utils/ApiError');
const { versionStatuses } = require('../config/articles');

const getSeqLabelVersionById = async (id) => {
  const seqLabelVersion = await SeqLabelVersion.findById(id).populate(['user', 'article', 'lastApprover']);
  seqLabelVersion.article.lastCurator = await User.findById(seqLabelVersion.article.lastCurator);
  return seqLabelVersion;
};

const updateSeqLabelVersionById = async (seqLabelVerId, updateBody) => {
  const seqLabelVersion = await getSeqLabelVersionById(seqLabelVerId);
  if (!seqLabelVersion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sequence labeling not found');
  }

  Object.assign(seqLabelVersion, updateBody);
  await seqLabelVersion.save();
  return seqLabelVersion;
};

const applySeqLabelVersionById = async (seqLabelVerId, user, { annotations, status }) => {
  const seqLabelVersion = await getSeqLabelVersionById(seqLabelVerId);
  if (!seqLabelVersion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sequence labeling not found');
  }

  if (status) {
    switch (status) {
      case versionStatuses.DECLINED:
        seqLabelVersion.lastApprover = user;
        break;
      case versionStatuses.APPROVED:
      case versionStatuses.MERGED:
        {
          const article = await Article.findById(seqLabelVersion.article.id);
          article.annotations = annotations;
          await article.save();
        }

        seqLabelVersion.lastApprover = user;
        break;
      default:
        break;
    }
  }

  seqLabelVersion.status = status;
  await seqLabelVersion.save();
  return seqLabelVersion;
};

module.exports = {
  getSeqLabelVersionById,
  updateSeqLabelVersionById,
  applySeqLabelVersionById,
};
