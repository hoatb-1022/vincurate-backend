const { EditVersion, User } = require('../models');

const getEditVersionById = async (id) => {
  const editVersion = await EditVersion.findById(id).populate(['user', 'article']);
  editVersion.article.lastCurator = await User.findById(editVersion.article.lastCurator);
  return editVersion;
};

module.exports = {
  getEditVersionById,
};
