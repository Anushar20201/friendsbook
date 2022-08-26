//importing Schema constructor and model function
const { Schema, model, Types } = require('mongoose');

// UserSchema below
const UserSchema = new Schema({
    username: {
        type: String,
        Unique: true,
        Required: true,
        Trimmed: true

    },
    email: {
        type: String,
        Unique: true,
        Required: true,
        //referred https://thewebdev.info/2022/03/16/how-to-validate-email-syntax-with-mongoose/
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]

    //Schema Settings - Creating a virtual called friendCount that retrieves the length of the user's friends array field on query.
});

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length
})


module.exports = model('User', UserSchema )