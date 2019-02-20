const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const CandidatesController = require('../controllers/candidates');

router.get('/:projectId', CandidatesController.candidates_get_all)

router.post('/', CandidatesController.candidates_create_candidate)

router.get('/candidate/:candidateId', CandidatesController.candidates_get_candidate)

router.patch('/:candidateId', CandidatesController.candidates_update_candidate)

router.patch('/notes/:candidateId/:taskId', CandidatesController.candidates_update_note)

router.delete('/:candidateId', CandidatesController.candidates_delete_candidate)

module.exports = router;