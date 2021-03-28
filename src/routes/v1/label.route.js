const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { labelValidation } = require('../../validations');
const { labelController } = require('../../controllers');

const router = express.Router();

router.get('/', labelController.getAllLabels);
router.get('/gen-bio-concepts', labelController.generateBioConceptLabels);

router
  .route('/')
  .post(auth('manageLabels'), validate(labelValidation.createLabel), labelController.createLabel)
  .get(labelController.getAllLabels);

router
  .route('/:labelId')
  .get(auth('manageLabels'), validate(labelValidation.getLabel), labelController.getLabel)
  .patch(auth('manageLabels'), validate(labelValidation.updateLabel), labelController.updateLabel)
  .delete(auth('manageLabels'), validate(labelValidation.deleteLabel), labelController.deleteLabel);

module.exports = router;
