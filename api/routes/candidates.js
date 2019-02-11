const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const CandidatesController = require('../controllers/candidates');

router.get('/', CandidatesController.candidates_get_all)

router.post('/', checkAuth, CandidatesController.candidates_create_candidate)

router.get('/candidate/:candidateId', CandidatesController.candidates_get_candidate)

router.patch('/:candidateId', checkAuth, CandidatesController.candidates_update_candidate)

router.delete('/:candidateId', checkAuth, CandidatesController.candidates_delete_candidate)

module.exports = router;