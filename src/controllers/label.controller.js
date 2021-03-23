const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { labelService } = require('../services');

const getAllLabels = catchAsync(async (req, res) => {
  const result = await labelService.getAllLabels();
  res.send(result);
});

const generateBioConceptLabels = catchAsync(async (req, res) => {
  await labelService.getBioConceptLabels();
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getAllLabels,
  generateBioConceptLabels,
};
