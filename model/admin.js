const mongoose = require("mongoose");

adminSchema = new mongoose.Schema({
    admin_id:{
        type:String,
        require:true,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("admin",adminSchema)