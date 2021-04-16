const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { labelService } = require('../services');
const ApiError = require('../utils/ApiError');

const getAllLabels = catchAsync(async (req, res) => {
  const result = await labelService.getAllLabels();
  res.send(result);
});

const generateBioConceptLabels = catchAsync(async (req, res) => {
  await labelService.getBioConceptLabels();
  res.status(httpStatus.NO_CONTENT).send();
});

const getLabel = catchAsync(async (req, res) => {
  const label = await labelService.getLabelById(req.params.labelId);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }
  res.send(label);
});

const createLabel = catchAsync(async (req, res) => {
  const label = await labelService.createLabel(req.user, req.body);
  res.status(httpStatus.CREATED).send(label);
});

const updateLabel = catchAsync(async (req, res) => {
  const label = await labelService.updateLabelById(req.params.labelId, req.body);
  res.send(label);
});

const deleteLabel = catchAsync(async (req, res) => {
  await labelService.deleteLabelById(req.params.labelId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getAllLabels,
  generateBioConceptLabels,
  getLabel,
  createLabel,
  updateLabel,
  deleteLabel,
};
