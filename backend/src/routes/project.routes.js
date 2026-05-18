const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject, updateProjectMembers, deleteProject } = require('../controllers/project.controller');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .delete(protect, deleteProject);

router.route('/:id/members')
  .put(protect, updateProjectMembers);

module.exports = router;
