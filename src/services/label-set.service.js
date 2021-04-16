const httpStatus = require('http-status');
const { LabelSet } = require('../models');
const ApiError = require('../utils/ApiError');

const getLabelSetById = async (id) => {
  return LabelSet.findById(id).populate('labels');
};

const getAllLabelSets = async () => {
  return LabelSet.find({});
};

const createLabelSet = async (user, labelSetBody) => {
  const labelSet = await LabelSet.create({
    creator: user,
    ...labelSetBody,
  });

  return labelSet;
};

const updateLabelSetById = async (projectId, updateBody) => {
  const labelSet = await getLabelSetById(projectId);
  if (!labelSet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label set not found');
  }

  Object.assign(labelSet, updateBody);
  await labelSet.save();
  return labelSet;
};

const deleteLabelSetById = async (labelId) => {
  const labelSet = await getLabelSetById(labelId);
  if (!labelSet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label set not found');
  }
  await labelSet.remove();
  return labelSet;
};

module.exports = {
  getAllLabelSets,
  getLabelSetById,
  createLabelSet,
  updateLabelSetById,
  deleteLabelSetById,
};
