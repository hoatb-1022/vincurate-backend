const { Label } = require('../models');

const getAllLabels = async () => {
  return Label.find({});
};

module.exports = {
  getAllLabels,
};
