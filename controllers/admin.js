const {Secret} = require("../helpers/keys");
const bcrypt = require("bcrypt");
const admin = require("../model/admin");
const jwt = require("jsonwebtoken")


exports.admin_post_signup = async (req,res)=>{
   const body = req.body;
   if(!body.admin_id || !body.email || !body.password){
       res.status(301).json("Some Fields are missing. Fill all Required Fields")
   }
   else{
      await admin.findOne({email:body.email}).then(users =>{
           if(users){
               res.status(301).json("Email Already Registered. Login");
           }
       })
       var password = await bcrypt.hash(req.body.password,10);
       user = {
         admin_id:body.admin_id,
         email:body.email,
         password:password,
       }
       try{
           var newUser = await new admin(user).save();
           res.status(200).json(newUser);
       }catch(err){
           if(err){
               res.status(301)
               res.send(err)
           }
       }
}   
    
}


exports.admin_get_login = (req,res)=>{
   res.json("Login as Admin")
}


exports.admin_post_login = async (req,res)=>{
   const body = req.body;
   admin.findOne({admin_id:body.admin_id}).then(
       (user)=>{
           if(!user){
               return res.status(301).json("you are not an admin please Sign in as a user");
           }
           bcrypt.compare(body.password,user.password).then(
               (valid)=>{
                   if(!valid){
                       return res.status(301).json("Incorrect Password!");
                   }
                   else{
                     const token = jwt.sign(
                        {email:user.email},
                        Secret,
                        {expiresIn:"200h"}
                    )
                    res.status(200).json({
                        admin_id:user.admin_id,
                        token:token
                    });

                   }
               }
           ).catch(
               (error) => { 
                   res.status(500).json({
                       error:"Server Error"
                   })
               }
           )
       }
   ).catch(
       (error)=>{
           res.status(500).json({
               error:"Error"
           })
       }
   )
   
}