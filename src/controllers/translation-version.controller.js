const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { translationVersionService } = require('../services');

const getTranslationVersion = catchAsync(async (req, res) => {
  const articleTranslationVer = await translationVersionService.getTranslationVersionById(req.params.translationVerId);
  if (!articleTranslationVer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article translation version not found');
  }
  res.send(articleTranslationVer);
});

const updateTranslationVersion = catchAsync(async (req, res) => {
  const translationVersion = await translationVersionService.updateTranslationVersionById(
    req.params.translationVerId,
    req.body
  );
  res.send(translationVersion);
});

const applyTranslationVersion = catchAsync(async (req, res) => {
  const {
    params: { translationVerId },
    user,
    body,
  } = req;
  const translationVersion = await translationVersionService.applyTranslationVersionById(translationVerId, user, body);
  res.send(translationVersion);
});

module.exports = {
  getTranslationVersion,
  updateTranslationVersion,
  applyTranslationVersion,
};
