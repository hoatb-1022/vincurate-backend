const express = require('express');
const { labelController } = require('../../controllers');

const router = express.Router();

router.get('/', labelController.getAllLabels);

module.exports = router;
