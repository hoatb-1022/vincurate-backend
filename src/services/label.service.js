const httpStatus = require('http-status');
const { Label, User } = require('../models');
const ApiError = require('../utils/ApiError');

const getLabelById = async (id) => {
  return Label.findById(id);
};

const getAllLabels = async () => {
  return Label.find({});
};

const getBioConceptLabels = async () => {
  const admin = await User.findOne({ role: 'admin' });

  return Promise.all(
    Label.bioConceptLabelsData().map(async (data) => {
      const newLabel = new Label(data);
      newLabel.isSystem = true;
      newLabel.creator = admin.id;
      await newLabel.save();
    })
  );
};

const createLabel = async (user, labelBody) => {
  const label = await Label.create({
    creator: user,
    ...labelBody,
  });

  return label;
};

const updateLabelById = async (projectId, updateBody) => {
  const label = await getLabelById(projectId);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }

  Object.assign(label, updateBody);
  await label.save();
  return label;
};

const deleteLabelById = async (labelId) => {
  const label = await getLabelById(labelId);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }
  await label.remove();
  return label;
};

module.exports = {
  getAllLabels,
  getBioConceptLabels,
  getLabelById,
  createLabel,
  updateLabelById,
  deleteLabelById,
};
