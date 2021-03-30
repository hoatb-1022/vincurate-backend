const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

const getCategoryById = async (id) => {
  return Category.findById(id);
};

const getAllCategories = async () => {
  return Category.find({});
};

const createCategory = async (user, categoryBody) => {
  const category = await Category.create({
    creator: user,
    ...categoryBody,
  });

  return category;
};

const updateCategoryById = async (projectId, updateBody) => {
  const category = await getCategoryById(projectId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  Object.assign(category, updateBody);
  await category.save();
  return category;
};

const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.remove();
  return category;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
