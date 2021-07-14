const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    article_post:{
        type:String,
        required:true

    },
    comment:[{
        text:{type:String},
        postedby:{
            type:Schema.ObjectId,
            ref:"users"
            }
    }],
    reports:[{
        text:String,
        reportby:{
            type:Schema.ObjectId,
            ref:"users"
        }
    }],
    createdon:{
        type:Date,
        default:Date.now()
    },
    likes:[{
        type:Schema.ObjectId,
        ref:"users"
    }],
    category:{
        type:Schema.ObjectId,
        ref:"category"
    },
    post_by:{
        type:Schema.ObjectId,
        ref:"users"
    }
})

module.exports = mongoose.model("article",articleSchema);