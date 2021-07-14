const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password1:{
        type:String,
        require:true
    },
    password2:{
        type:String,
        require:true
    },
    followers:[{
        type:Schema.ObjectId,
        ref:"users"
    }],
    following:[{
        type:Schema.ObjectId,
        ref:"users"
    }]
})

module.exports = mongoose.model("users",userSchema);