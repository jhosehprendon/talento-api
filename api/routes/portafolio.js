const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const PortafolioController = require('../controllers/portafolio');

router.get('/:userId', PortafolioController.portafolio_get_all_projects)

router.post('/', PortafolioController.portafolio_create_project)

router.get('/project/:projectId', PortafolioController.portafolio_get_project)

router.patch('/project/:projectId', PortafolioController.portafolio_update_project)

// router.delete('/:projectId', PortafolioController.projects_delete_project)

module.exports = router;