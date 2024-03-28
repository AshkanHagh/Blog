const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({

    comment : {
        type : String,
        required : true
    },
    senderId : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    receiverPostId : [{
        type : Schema.Types.ObjectId,
        ref : 'Post'
    }]

}, {timestamps : true});



module.exports = mongoose.model('Comment', commentSchema);