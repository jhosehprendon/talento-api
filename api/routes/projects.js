const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ProjectsController = require('../controllers/projects');

router.get('/:userId', ProjectsController.projects_get_all)

router.post('/', ProjectsController.projects_create_project)

router.get('/project/:projectId', ProjectsController.projects_get_project)

router.patch('/:projectId', ProjectsController.projects_update_project)

router.delete('/:projectId', ProjectsController.projects_delete_project)

module.exports = router;