const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({

    title : {
        type : String,
        required : true,
        unique : true,
        length : {
            minimize : 7
        }
    },
    info : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
        length : {
            maximize : 255
        }
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    image : {
        type : String,
        required : false,
        default : ''
    },
    likeId : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    commentId : [{
        type : Schema.Types.ObjectId,
        ref : 'Comment'
    }]

}, {timestamps : true});


module.exports = mongoose.model('Post', postSchema);