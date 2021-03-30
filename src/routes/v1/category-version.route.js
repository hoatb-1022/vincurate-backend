const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { categoryVersionValidation } = require('../../validations');
const { categoryVersionController } = require('../../controllers');

const router = express.Router();

router
  .route('/:categoryVerId')
  .get(validate(categoryVersionValidation.getCategoryVersion), categoryVersionController.getCategoryVersion)
  .patch(
    auth('manageCategoryVersions'),
    validate(categoryVersionValidation.updateCategoryVersion),
    categoryVersionController.updateCategoryVersion
  );

router.post(
  '/:categoryVerId/apply',
  auth('manageCategoryVersions'),
  validate(categoryVersionValidation.applyCategoryVersion),
  categoryVersionController.applyCategoryVersion
);

module.exports = router;
