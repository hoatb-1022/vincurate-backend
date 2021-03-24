const express = require('express');
const validate = require('../../middlewares/validate');
const { editVersionValidation } = require('../../validations');
const { editVersionController } = require('../../controllers');

const router = express.Router();

router.route('/:editVerId').get(validate(editVersionValidation.getEditVersion), editVersionController.getEditVersion);

module.exports = router;
