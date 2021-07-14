const jwt = require("jsonwebtoken");
const {Secret} = require("./keys")
const users = require("../model/users");


module.exports = (req,res,next)=>{
         const bearerHeader = req.headers["authorization"];
         const token = bearerHeader && bearerHeader.split(" ")[1]

         if(token == null){
             return res.status(401).json({message:"Unauthorized"})
         }
         jwt.verify(token, Secret,(err,payload)=>{
             if(err){
                 return res.status(401).json({message:"Unauthorized"});
             }
             const {id} = payload
             users.findById(id).then(
                 userdata=>{
                    req.user = userdata
                 }
             )

             next()
         })
         } 