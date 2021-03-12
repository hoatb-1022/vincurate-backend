const catchAsync = require('../utils/catchAsync');
const { labelService } = require('../services');

const getAllLabels = catchAsync(async (req, res) => {
  const result = await labelService.getAllLabels();
  res.send(result);
});

module.exports = {
  getAllLabels,
};
