const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    writer:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    content:{
        type:String,
        required:true

    },
    repoonseTo:{
            type:Schema.Types.ObjectId,
            ref:"users"
    },

    postId:{
        type:Schema.Types.ObjectId,
        ref:"article"
    }
})

module.exports = mongoose.model("comments",commentSchema);