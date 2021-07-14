const {Secret} = require("../helpers/keys");
const bcrypt = require("bcrypt");
const users = require("../model/users");
const jwt = require("jsonwebtoken")

exports.get_signup = async (req,res)=>{
   await res.json("Enter Your Details")
}



exports.post_signup = async (req,res)=>{
   const body = req.body;
   if(!body.username || !body.email || !body.password1 || !body.password2){
       res.status(301).json("Some Fields are missing. Fill all Required Fields")
   }
   if(body.password1 !== body.password2){
       res.status(301).json("password doesn't match")
   }
   else{
      await users.findOne({email:body.email}).then(users =>{
           if(users){
               res.status(301).json("Email Already Registered. Login");
           }
       })
       var password = await bcrypt.hash(req.body.password1,10);
       var repass = await bcrypt.hash(req.body.password2,10);
       user = {
           username:body.username,
           email:body.email,
           password1:password,
           password2:repass
       }
       try{
           var newUser = await new users(user).save();
           res.send(newUser);
       }catch(err){
           if(err){
               res.status(301)
               res.send(err)
           }
       }
}   
    
}


exports.get_login = (req,res)=>{
   res.json("Enter your Login Details")
}


exports.post_login = async (req,res)=>{
   const body = req.body;
  await users.findOne({email:body.email}).then(
       (user)=>{
           if(!user){
               return res.status(302).redirect("/api/v1/sign_up");
           }
           bcrypt.compare(body.password1,user.password1).then(
               (valid)=>{
                   if(!valid){
                       return res.status(401).json("Incorrect Password!");
                   }
                   else{
                     const token = jwt.sign(
                        {email:user.email,id:user._id},
                        Secret,
                        {expiresIn:"200h"}
                    )
                    res.status(200).json({
                        firstname:user.first_name,
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


exports.follow = (req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id; 

    users.findByIdAndUpdate(req.body.followId,{
        $push:{followers:postBy}
    },{new:true},(err,result)=>{
        if(err){
            res.status(422).json({
                error:err
            })  
        }
    users.findByIdAndUpdate(postBy,{
        $push:{following:req.body.followId}
    },{new:true}).then(result =>{
        res.json(result)
    }).catch( err =>{
        return res.status(422).json({error:err})
    })
    })
}

exports.unfollow = (req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id; 

    users.findByIdAndUpdate(req.body.followId,{
        $pull:{followers:postBy}
    },{new:true},(err,result)=>{
        if(err){
            res.status(422).json({
                error:err
            })  
        }
    users.findByIdAndUpdate(postBy,{
        $pull:{following:req.body.followId}
    },{new:true}).then(result =>{
        res.json(result)
    }).catch( err =>{
        return res.status(422).json({error:err})
    })
    })
}