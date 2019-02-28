const express = require('express');
const router = express.Router();
const multer =  require('multer');
// const checkAuth = require('../middleware/check-auth');

const CandidatesController = require('../controllers/candidates');

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


router.get('/:projectId', CandidatesController.candidates_get_all)

router.post('/', upload.single('candidateCV'), CandidatesController.candidates_create_candidate)

router.get('/candidate/:candidateId', CandidatesController.candidates_get_candidate)

router.patch('/:candidateId', upload.single('candidateCV'), CandidatesController.candidates_update_candidate)

router.patch('/notes/:candidateId/:taskId', CandidatesController.candidates_update_note)

router.delete('/:candidateId', CandidatesController.candidates_delete_candidate)

module.exports = router;