const httpStatus = require('http-status');
const { Project, ProjectRole } = require('../models');
const ApiError = require('../utils/ApiError');

const queryProjects = async (filter, options) => {
  const projects = await Project.paginate(filter, options);
  return projects;
};

const getProjectById = async (id) => {
  return Project.findById(id).populate(['owner', 'articles']);
};

const createProject = async (projectBody) => {
  const project = await Project.create(projectBody);
  return project;
};

const updateProjectById = async (projectId, updateBody) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  Object.assign(project, updateBody);
  await project.save();
  return project;
};

const deleteProjectById = async (projectId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  await project.remove();
  return project;
};

const addProjectRoleById = async (projectId, roleBody) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const userRole of roleBody) {
    // eslint-disable-next-line no-await-in-loop
    const user = await getProjectById(userRole.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const projectRole = new ProjectRole(userRole);
    project.roles.push(projectRole);
  }

  await project.save();
  return project;
};

const removeProjectRoleById = async (projectId, roleId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const index = project.roles.findIndex((role) => role.id === roleId);
  if (index < 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assigned role not found');
  }
  project.roles.splice(index, 1);

  await project.save();
  return project;
};

module.exports = {
  queryProjects,
  getProjectById,
  createProject,
  updateProjectById,
  deleteProjectById,
  addProjectRoleById,
  removeProjectRoleById,
};
