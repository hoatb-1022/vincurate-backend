const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { editVersionValidation } = require('../../validations');
const { editVersionController } = require('../../controllers');

const router = express.Router();

router.route('/:editVerId').get(validate(editVersionValidation.getEditVersion), editVersionController.getEditVersion);

router.post(
  '/:editVerId/apply',
  auth('manageEditVersions'),
  validate(editVersionValidation.applyEditVersion),
  editVersionController.applyEditVersion
);

module.exports = router;
