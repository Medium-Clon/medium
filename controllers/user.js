const {Secret} = require("../helpers/keys");
const bcrypt = require("bcrypt");
const users = require("../model/users");
const jwt = require("jsonwebtoken");
const Token = require("../model/Token.model");

exports.get_signup = async (req,res)=>{
   await res.json("Enter Your Details")
}



exports.post_signup = async (req,res)=>{
   const body = req.body;
   if(!body.username || !body.email || !body.password1 || !body.password2){
       res.status(301).json("Some Fields are missing. Fill all Required Fields")
   }
   else{
    if(body.password1 !== body.password2){
        res.status(301).json("password doesn't match")
    }
    else{
        let newUser = await users.findOne({ email: body.email }).then(
            async (user)=>{
                if(user) {
                    res.status(422).json("user already exist")
                  }
                  else{
                    var password = await bcrypt.hash(req.body.password1,10);
                    var repass = await bcrypt.hash(req.body.password2,10);
                
                    user = {
                        username:body.username,
                        email:body.email,
                        password1:password,
                        password2:repass
                      }
              
                  newUzer = new users(user);
                 
                  const token = {
                    userId:newUzer._id,
                    token:jwt.sign({ id: newUzer._id }, Secret)
                  };
                  tk = new Token(token);
                  await newUzer.save();
                  await tk.save();  
                  res.status(201).json(data = {
                    userId: newUzer._id,
                    email: newUzer.email,
                    name: newUzer.username,
                    token: token,
                  });

            }
      })
    }
   }
  


  
 //   const check = await users.find({email:body.email});
 //   if(check){
 //       res.status(302).json("Email Already Registered");
 //   }
 //         var newUser =  new users(user);
 //          const TK = {
 //              userId:newUser._id,
 //              token:jwt.sign({ id: newUser._id }, Secret)
 //           };
 //          userToken = new TokenModel(TK);
 //          await userToken.save()
 //          await newUser.save();
 //          res.status(200).json({email:newUser.email,token:userToken.token});
 //  else{
 //      var password = await bcrypt.hash(req.body.password1,10);
 //      var repass = await bcrypt.hash(req.body.password2,10);
 //      user = {
 //          username:body.username,
 //          email:body.email,
 //          password1:password,
 //          password2:repass
 //      }
 //      try{
 //       let user = await users.findOne({email:body.email});
 //       }catch(err){
 //           res.status(302).json("Email Already Registered. Login");
 //       }
 //          var newUser =  new users(user);
 //          const token = jwt.sign({ id: newUser._id }, Secret);
 //          await newUser.save();
 //          res.status(200).json(newUser.email,newUser.username,token);
 //   }
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