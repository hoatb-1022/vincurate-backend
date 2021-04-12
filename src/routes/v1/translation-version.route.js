const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { translationVersionValidation } = require('../../validations');
const { translationVersionController } = require('../../controllers');

const router = express.Router();

router
  .route('/:translationVerId')
  .get(validate(translationVersionValidation.getTranslationVersion), translationVersionController.getTranslationVersion)
  .patch(
    auth('manageTranslationVersions'),
    validate(translationVersionValidation.updateTranslationVersion),
    translationVersionController.updateTranslationVersion
  );

router.post(
  '/:translationVerId/apply',
  auth('manageTranslationVersions'),
  validate(translationVersionValidation.applyTranslationVersion),
  translationVersionController.applyTranslationVersion
);

module.exports = router;
