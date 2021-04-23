const httpStatus = require('http-status');
const { User, Label, LabelSet, Article, Category, Project } = require('../models');
const ApiError = require('../utils/ApiError');
const articleServices = require('./article.service');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const getUserProjects = async (userId) => {
  return Project.find({ $or: [{ owner: userId }, { 'roles.user': userId }] }).populate(['owner', 'roles.user']);
};

const getUserArticles = async (userId) => {
  const projects = await getUserProjects(userId);
  const articles = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const project of projects) {
    // eslint-disable-next-line no-restricted-syntax
    for (const art of project.articles) {
      // eslint-disable-next-line no-await-in-loop
      const article = await articleServices.getArticleById(art);
      articles.push(article);
    }
  }
  return articles;
};

const getUserLabels = async (userId) => {
  return Label.find({ creator: userId }).populate('creator');
};

const getUserLabelSets = async (userId) => {
  return LabelSet.find({ creator: userId }).populate(['creator', 'labels']);
};

const getUserCategories = async (userId) => {
  return Category.find({ creator: userId }).populate('creator');
};

module.exports = {
  createUser,
  getAllUsers,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserArticles,
  getUserProjects,
  getUserLabels,
  getUserLabelSets,
  getUserCategories,
};
