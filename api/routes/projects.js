const express = require('express');
const router = express.Router();
const multer =  require('multer');
const checkAuth = require('../middleware/check-auth');

const ProjectsController = require('../controllers/projects');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', ProjectsController.projects_get_all)

router.post('/', checkAuth, upload.single('projectImage'), ProjectsController.projects_create_project)

router.get('/:projectId', ProjectsController.projects_get_project)

router.patch('/:projectId', checkAuth, upload.single('projectImage'), ProjectsController.projects_update_project)

router.delete('/:projectId', checkAuth, ProjectsController.projects_delete_project)

module.exports = router;