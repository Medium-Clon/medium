const article = require("../model/article");
const category = require("../model/category");
const users = require("../model/users");
const {reqUser} = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const {Secret} = require("../helpers/keys");
const {decode} = require("../helpers/decode");


exports.all_article = async (req,res)=>{
    const articles = await article.find().sort({createdOn:"desc"});
    if(!articles){
        res.status(404).json(new Error("No Articles"))
    }
    else{
        res.status(200).json(articles);
    }

}

exports.create_article = async(req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id; 

    const catigory = await category.findById({_id:req.body.category});
    if(!catigory){
        res.status(401).json("category is incorrect")
    }
 

    const post = {
        title:req.body.title,
        article_post:req.body.article_post,
        category:catigory._id,
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

exports.one_article = async (req,res)=>{
    const oneArticle = await article.findById(req.params._id);
    if(!oneArticle){
        res.status(404).json("Article Not Found");
    }
    else{
        res.status(201).json(oneArticle);
    }
}

exports.comment = (req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id; 
    comment = {
        text:req.body.text,
        postedby:postBy
    }
    article.findByIdAndUpdate(req.body._id,{
        $push:{likes:postBy}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            
            return res.status(422).json({error:err})
        }
        else{
            console.log(result)
            res.json(result)
        }
    })
}

exports.search_article = (req,res)=>{
    let  pattern = new RegExp("^"+req.body.query);
    article.find({title:"^"+req.body.query})
    .then(article=>{
        res.json({article})
    }).catch(err=>{
        console.log(err)
    })
}


exports.report = (req,res)=>{
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1]
    let postBy = jwt.verify(token,Secret).id; 
    article.findByIdAndUpdate(req.body._id,{
        $push:{reports:{text:req.body.text,reportby:postBy}}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            console.log("testing")
            res.json(result)
        }
    })
}
