const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { seqLabelVersionValidation } = require('../../validations');
const { seqLabelVersionController } = require('../../controllers');

const router = express.Router();

router
  .route('/:seqLabelVerId')
  .get(validate(seqLabelVersionValidation.getSeqLabelVersion), seqLabelVersionController.getSeqLabelVersion)
  .patch(
    auth('manageSeqLabelVersions'),
    validate(seqLabelVersionValidation.updateSeqLabelVersion),
    seqLabelVersionController.updateSeqLabelVersion
  );

router.post(
  '/:seqLabelVerId/apply',
  auth('manageSeqLabelVersions'),
  validate(seqLabelVersionValidation.applySeqLabelVersion),
  seqLabelVersionController.applySeqLabelVersion
);

module.exports = router;
