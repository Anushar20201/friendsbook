const router = require('express').Router();

//importing all functions from thought-controller
const {
    getAllThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller')

//Getting all thoughts routes thr' /
router
    .route('/')
    .get(getAllThoughts)

//Posting routes thr' /userId
router
    .route('/:userId')
    .post(createThought)

//get, update and delete routes thr' /Id
router
    .route('/:id')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought)

//post route thr' /id/reaction
router
    .route('/:thoughtId/reaction')
    .post(addReaction)

//delete route based on thoughtId and reactionId
router
    .route('/:thoughtId/:reactionId')
    .delete(deleteReaction)

module.exports = router;