const express = require('express')
const {
  registerCandidate,
  fetchCandidates,
  fetchCandidate,
  updateCandidate,
  deleteCandidate
} = require('./candidate.controller')
const candidateRouter = express.Router()

candidateRouter
  .post('/register', registerCandidate)
  .post('/', fetchCandidates) //http:post due to filtering and searching
  .get('/:id', fetchCandidate)
  .patch('/update/:id', updateCandidate)
  .delete('/delete/:id', deleteCandidate)

module.exports = candidateRouter
