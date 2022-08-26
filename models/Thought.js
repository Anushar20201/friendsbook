//adding Thought model
const { Schema, model, Types } = require('mongoose');
const dateFormat = require("../utils/dateFormat");

const ReactionSchema = new Schema(
    {
        reactionId: {
            //Using Mongoose's ObjectId data type
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            //setting 280 character maximum
            trim: true,
            minlength: 1,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true
           
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (value) => dateFormat(value),
        },
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

const ThoughtSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        
        },
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (value) => dateFormat(value),
        },
        //Array of nested documents created with the reactionSchema - These are like replies
        reactions: [ReactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

module.exports = model("Thought", ThoughtSchema);