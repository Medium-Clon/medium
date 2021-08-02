const article = require("../model/article");
const category = require("../model/category");
const users = require("../model/users");
const {reqUser} = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const {Secret} = require("../helpers/keys");
const {decode} = require("../helpers/decode");


exports.all_article = async (req,res)=>{
    const articles = await article.find().sort({createdOn:"desc"});
    if(articles.length == 0){
        res.status(404).json("No Articles")
    }
    else{
        res.status(200).json(articles);
    }

}

exports.one_article = async (req,res)=>{
   try{
    const oneArticle = await article.findById(req.params._id);
    if(!oneArticle){
        res.status(404).json("Article Not Found");
    }
    else{
        res.status(201).json(oneArticle);
    }
   }
   catch(err){
       if(err){
           res.json("Not Found")
       }
   }
   
   
}

exports.article_by_category = async (req,res)=>{ 
try {
    const catArticle = await article.find({category:req.params._id});
    if(catArticle.length === 0){
        res.status(302).json("No article in this category")
    }
    else{
        res.status(201).json(catArticle)
    }
    
} catch (error) {
    if(error){
        res.status(500).json("Server got bugz");
        console.log(error)
        return;

    }
}
}

exports.create_article = async(req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id; 

 

    const post = {
        title:req.body.title,
        article_post:req.body.article_post,
        category:req.body.category,
        post_by:postBy
    }
    const newArticle = await new article(post).save();
    if(!newArticle){
        res.status(500).json("Something Went Wrong")
    }
    else{
        res.status(201).json(newArticle);
    }
    console.log(newArticle)
}
 

exports.like = (req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id; 
    article.findByIdAndUpdate(req.body._id,{
        $push:{likes:postBy}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
}

exports.unlike = (req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id; 
    article.findByIdAndUpdate(req.body._id,{
        $pull:{likes:postBy}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
}


exports.comment = (req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id; 
    comment = {
        text:req.body.text,
        postedby:postBy
    }
    console.log(req.body._id)
    article.findByIdAndUpdate(req.body._id,{
        $push:{comment:comment}
    },{
        new:true
    })
    .populate("comment.postedby","username")
    .exec((err,result)=>{
        if(err){  
            return res.status(422).json({error:err})
        }
        else{
            console.log(result)
            res.json(result)
        }
    })
}

exports.search_article = async (req,res)=>{
    if(!req.query.search){
        res.status(301).json("Bad Request")
    }
    pattern = new RegExp(req.query.search)
    articles = await article.find({article_post:pattern});
   //console.log(articles)
   if(articles.length == 0){
       res.status(402).json("No such article")
   }
   else{
      res.status(200).json(articles)
   }

}


exports.report = (req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id;
    reports = {
        text:req.body.text,
        reportby:postBy
    }
    article.findByIdAndUpdate(req.body._id,{
        $push:{reports:reports}
    },{
        new:true
    })
    .populate("reports.reportby","username -_id")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
}
