const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { labelSetService } = require('../services');
const ApiError = require('../utils/ApiError');

const getAllLabelSets = catchAsync(async (req, res) => {
  const result = await labelSetService.getAllLabelSets();
  res.send(result);
});

const getLabelSet = catchAsync(async (req, res) => {
  const label = await labelSetService.getLabelSetById(req.params.labelId);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label set not found');
  }
  res.send(label);
});

const createLabelSet = catchAsync(async (req, res) => {
  const project = await labelSetService.createLabelSet(req.user, req.body);
  res.status(httpStatus.CREATED).send(project);
});

const updateLabelSet = catchAsync(async (req, res) => {
  const label = await labelSetService.updateLabelSetById(req.params.labelId, req.body);
  res.send(label);
});

const deleteLabelSet = catchAsync(async (req, res) => {
  await labelSetService.deleteLabelSetById(req.params.labelId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getAllLabelSets,
  getLabelSet,
  createLabelSet,
  updateLabelSet,
  deleteLabelSet,
};
