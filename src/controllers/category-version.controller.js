const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { categoryVersionService } = require('../services');

const getCategoryVersion = catchAsync(async (req, res) => {
  const articleCategoryVer = await categoryVersionService.getCategoryVersionById(req.params.categoryVerId);
  if (!articleCategoryVer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article category version not found');
  }
  res.send(articleCategoryVer);
});

const updateCategoryVersion = catchAsync(async (req, res) => {
  const categoryVersion = await categoryVersionService.updateCategoryVersionById(req.params.categoryVerId, req.body);
  res.send(categoryVersion);
});

const applyCategoryVersion = catchAsync(async (req, res) => {
  const {
    params: { categoryVerId },
    user,
    body,
  } = req;
  const categoryVersion = await categoryVersionService.applyCategoryVersionById(categoryVerId, user, body);
  res.send(categoryVersion);
});

module.exports = {
  getCategoryVersion,
  updateCategoryVersion,
  applyCategoryVersion,
};
