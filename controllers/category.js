const catmodel = require("../model/category")

exports.category = async (req,res)=>{
    const category = {
        name: req.body.name,
    }

    const newCategory = await new catmodel(category).save();
    if(!newCategory){
        res.status(422).json({error:error});
    }
    else{
        res.status(200).json({
            Success:newCategory + " Created"
        })
    }
}

exports.all_category = async(req,res)=>{
    const categories = await catmodel.find({}).sort({
        date:-1
    });
    if(!categories){
        res.status(404).json("No category Found")
    }
    else{
        res.status(200).json(categories)
    }
}

exports.sortCategory = async(req,res)=>{
    const categories = await catmodel.findById({_id:req.params._id}).select("article").populate("article");
    if(!categories){
        res.status(404).json("Not Found")
    }
    else{
        res.status(200).json(categories)
    }
}