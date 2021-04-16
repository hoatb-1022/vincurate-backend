const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { labelSetValidation } = require('../../validations');
const { labelSetController } = require('../../controllers');

const router = express.Router();

router.get('/', labelSetController.getAllLabelSets);

router
  .route('/')
  .post(auth('manageLabelSets'), validate(labelSetValidation.createLabelSet), labelSetController.createLabelSet)
  .get(labelSetController.getAllLabelSets);

router
  .route('/:labelSetId')
  .get(auth('manageLabelSets'), validate(labelSetValidation.getLabelSet), labelSetController.getLabelSet)
  .patch(auth('manageLabelSets'), validate(labelSetValidation.updateLabelSet), labelSetController.updateLabelSet)
  .delete(auth('manageLabelSets'), validate(labelSetValidation.deleteLabelSet), labelSetController.deleteLabelSet);

module.exports = router;
