const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { projectController } = require('../../controllers');
const projectValidation = require('../../validations/project.validation');

const router = express.Router();

router
  .route('/')
  .post(auth('manageProjects'), validate(projectValidation.createProject), projectController.createProject)
  .get(auth('getProjects'), validate(projectValidation.getProject), projectController.getProjects);

router
  .route('/:projectId')
  .get(auth('getProjects'), validate(projectValidation.getProject), projectController.getProject)
  .patch(auth('manageProjects'), validate(projectValidation.updateProject), projectController.updateProject)
  .delete(auth('manageProjects'), validate(projectValidation.deleteProject), projectController.deleteProject);

router.post(
  '/:projectId/add-role',
  auth('manageProjects'),
  validate(projectValidation.addProjectRole),
  projectController.addProjectRole
);

router.post(
  '/:projectId/remove-role',
  auth('manageProjects'),
  validate(projectValidation.removeProjectRole),
  projectController.removeProjectRole
);

module.exports = router;
