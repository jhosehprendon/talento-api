const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const PortafolioController = require('../controllers/portafolio');

// router.get('/:userId', PortafolioController.projects_get_all)

router.post('/', PortafolioController.portafolio_create_project)

// router.get('/project/:projectId', PortafolioController.projects_get_project)

// router.patch('/:projectId', PortafolioController.projects_update_project)

// router.delete('/:projectId', PortafolioController.projects_delete_project)

module.exports = router;