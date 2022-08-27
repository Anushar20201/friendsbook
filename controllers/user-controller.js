const { User } = require('../models');

const userController = {

  // getting all users
  getAllUsers(req, res) {
    User.find({})
      //We want to get the full document form of an objectID in a different document.
      .populate({
        // The .populate() method should contain an object with the property of path, which refers to the field that should be populated.
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      // Mongoose has a .sort() method to help with this. After the .select() method, use .sort({ _id: -1 }) to sort in DESC order by the _id value. This gets the newest pizza because a timestamp value is hidden somewhere inside the MongoDB ObjectId.
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //Getting single user by its _id and populated thought and friend data
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate([{
        path: 'thoughts',
        select: '-__v'
      },
      {
        path: "friends",
        select: "-__v",
      },
      ])
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Sorry no user found' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //Posting a New User
  createNewUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  //update a User by its Id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Sorry no user found' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  //deleting a User by its id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id }, { new: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Sorry no user found' });
          return;
        }
        res.json(true);
      })
      .catch(err => res.status(400).json(err));
  },



  //Adding a new Friend
  addFriend({ params }, res) {
    //push is update operator, if u want to avoid duplicates- then use addToSet operator in place of $push
    User.findOneAndUpdate({ _id: params.id }, { $push: { friends: params.friendId } }, { new: true })
      .populate({ path: 'friends', select: '-__v' })
      .select('-__v')
      .then(dbUsersData => {
        if (!dbUsersData) {
          res.status(404).json({ message: 'Sorry no user found' });
          return;
        }
        res.json(dbUsersData);
      })
      .catch(err => res.json(err));
  },

  //Deleting a Friend
  deleteFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.id },
      { $pull: { friends: params.friendId } },
      { new: true })
      .populate({ path: 'friends', select: '-__v' })
      //Note that we also used the select option inside of populate(), so that we can tell Mongoose that we don't care about the __v field on comments either. The minus sign - in front of the field indicates that we don't want it to be returned. If we didn't have it, it would mean that it would return only the __v field.
      .select('-__v')
      .then(dbUsersData => {
        if (!dbUsersData) {
          res.status(404).json({ message: 'Sorry no user found' });
          return;
        }
        res.json(true);
      })
      .catch(err => res.status(400).json(err));
  },
};

module.exports = userController;