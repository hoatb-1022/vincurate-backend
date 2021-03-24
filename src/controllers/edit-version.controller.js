const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { editVersionService } = require('../services');

const getEditVersion = catchAsync(async (req, res) => {
  const articleEditVer = await editVersionService.getEditVersionById(req.params.editVerId);
  if (!articleEditVer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article edit version not found');
  }
  res.send(articleEditVer);
});

module.exports = {
  getEditVersion,
};
