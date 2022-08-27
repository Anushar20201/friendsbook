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
}



























}

module.exports = thoughtController;