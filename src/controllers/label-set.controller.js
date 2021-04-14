const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { labelSetService } = require('../services');
const ApiError = require('../utils/ApiError');

const getAllLabelSets = catchAsync(async (req, res) => {
  const result = await labelSetService.getAllLabelSets();
  res.send(result);
});

const getLabelSet = catchAsync(async (req, res) => {
  const labelSet = await labelSetService.getLabelSetById(req.params.labelSetId);
  if (!labelSet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label set not found');
  }
  res.send(labelSet);
});

const createLabelSet = catchAsync(async (req, res) => {
  const labelSet = await labelSetService.createLabelSet(req.user, req.body);
  res.status(httpStatus.CREATED).send(labelSet);
});

const updateLabelSet = catchAsync(async (req, res) => {
  const labelSet = await labelSetService.updateLabelSetById(req.params.labelSetId, req.body);
  res.send(labelSet);
});

const deleteLabelSet = catchAsync(async (req, res) => {
  await labelSetService.deleteLabelSetById(req.params.labelSetId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getAllLabelSets,
  getLabelSet,
  createLabelSet,
  updateLabelSet,
  deleteLabelSet,
};
