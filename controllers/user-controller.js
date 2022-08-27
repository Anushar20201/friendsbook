const { User } = require('../models');

const userController = {

  // getting all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
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
          res.status(404).json({ message:  'Sorry no user found' });
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
          res.status(404).json({ message:  'Sorry no user found' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },



  //Adding a new Friend
  addFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.id },{ $push: { friends: params.friendId } },{ new: true })
      .populate({ path: 'friends', select: '-__v' })
      .select('-__v')
      .then(dbUsersData => {
        if (!dbUsersData) {
          res.status(404).json({ message:  'Sorry no user found' });
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
      .select('-__v')
      .then(dbUsersData => {
        if (!dbUsersData) {
          res.status(404).json({ message:  'Sorry no user found' });
          return;
        }
        res.json(dbUsersData);
      })
      .catch(err => res.status(400).json(err));
  },
};

module.exports = userController;