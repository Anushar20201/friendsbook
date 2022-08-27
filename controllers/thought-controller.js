const {Thought, User} = require('../models');

const thoughtController = {

// getting all thoughts
getAllThoughts(req, res){
    //finding all, removing versions and sorting in descending order
    Thought.find({}).select('-__v').sort({_id: -1})
    .then(data => res.json(data))
    .catche(err => {
        console.log(err);
        res.sendStatus(400)
    });
},

//getting a thought by id
getSingleThought({params},res){
    Thought.findOne({_id: params.id}).select('-__v')
    .then(data => res.json(data))
    .catche(err => {

        console.log(err);
        res.sendStatus(400)
    });
},

//updating thought with help of id
updateThought({params, body}, res){
    Thought.findOneAndUpdate({_id: params.id}, body, {new : true})
    .then(data => {
        if(!data){
            res.status(404).json({message: 'not found'});
            return;
        }
        res.json(data)
    })
    .catche(err => {
        console.log(err);
        res.sendStatus(400)
    });
},

//deleting thought
deleteThought({params}, res){
  Thought.findOneAndDelete({_id: params.id}, {new: true})
  .then(data => {
    if(!data){
        res.status(404).json({message: 'not found'});
        return;
    }
    res.json(true)
})
.catche(err => {
    console.log(err);
    res.sendStatus(400)
});
},

    //Creating a thought
    createThought({ params, body }, res) {
        Thought.create(body)
          .then(({ _id }) => {
            //finding user and pushing this thought to User
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id } },
                { new: true }
              )
              })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'Not found' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
},


//updating reaction
addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reaction: body } },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'Not found' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },



  //deleting reaction based on id

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
        //gettong thought's id
    { _id: params.thoughtId },
    //getting id of a sub-documenet(reactionId) here from the params
    { $pull: { reaction: { reactionId: params.reactionId }}},
    { new: true }
  )
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.json(err));
},




















}

module.exports = thoughtController;