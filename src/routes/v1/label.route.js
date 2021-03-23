const express = require('express');
const { labelController } = require('../../controllers');

const router = express.Router();

router.get('/', labelController.getAllLabels);
router.get('/gen-bio-concepts', labelController.generateBioConceptLabels);

module.exports = router;
