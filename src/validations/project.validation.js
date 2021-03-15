const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    type: Joi.string().required(),
    ownerId: Joi.string().custom(objectId),
  }),
};

const getProjects = {
  query: Joi.object().keys({
    title: Joi.string(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
    })
    .min(1),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const addProjectRole = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    body: Joi.object()
      .keys({
        user: Joi.string().custom(objectId),
        role: Joi.string(),
      })
      .min(1),
  }),
};

const removeProjectRole = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    roleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectRole,
  removeProjectRole,
};
