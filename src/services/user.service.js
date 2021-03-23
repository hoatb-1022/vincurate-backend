const httpStatus = require('http-status');
const { User, Project } = require('../models');
const ApiError = require('../utils/ApiError');

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

const getUserArticles = async (userId) => {
  const { projects } = await User.findById(userId).populate('projects');
  const articles = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const p of projects) {
    // eslint-disable-next-line no-await-in-loop
    const project = await Project.findById(p.id).populate('articles');

    // eslint-disable-next-line no-restricted-syntax
    for (const a of project.articles) {
      a.project = p;
    }

    articles.push(...project.articles);
  }

  return articles;
};

const getUserProjects = async (userId) => {
  return User.findById(userId).populate('projects');
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
  getUserProjects
};
