const { EditVersion } = require('../models');

const getEditVersionById = async (id) => {
  return EditVersion.findById(id).populate(['user', 'article']);
};

module.exports = {
  getEditVersionById,
};
