const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { seqLabelVersionService } = require('../services');

const getSeqLabelVersion = catchAsync(async (req, res) => {
  const articleSeqLabelVer = await seqLabelVersionService.getSeqLabelVersionById(req.params.seqLabelVerId);
  if (!articleSeqLabelVer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article sequence labeling version not found');
  }
  res.send(articleSeqLabelVer);
});

const updateSeqLabelVersion = catchAsync(async (req, res) => {
  const seqLabelVersion = await seqLabelVersionService.updateSeqLabelVersionById(req.params.seqLabelVerId, req.body);
  res.send(seqLabelVersion);
});

const applySeqLabelVersion = catchAsync(async (req, res) => {
  const {
    params: { seqLabelVerId },
    user,
    body,
  } = req;
  const seqLabelVersion = await seqLabelVersionService.applySeqLabelVersionById(seqLabelVerId, user, body);
  res.send(seqLabelVersion);
});

module.exports = {
  getSeqLabelVersion,
  updateSeqLabelVersion,
  applySeqLabelVersion,
};
