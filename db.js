const mongoose = require("mongoose");
const {mongouri,MongoUri} = require("./helpers/keys");




exports.connection = async()=>{

  try {
    if(process.env.NODE_ENV === "test"){
      const Mockgoose = require("mockgoose").Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage()
      .then(()=>{
        mongoose.connect(
          MongoUri, {
          useNewUrlParser:true, 
          useUnifiedTopology:true, 
          useCreateIndex:true
      }).then((err,res)=>{
        if(err)
        return rejection(err);
        resolve(err)
      })
        
      })

    }
    else{
      await mongoose.connect(
        mongouri,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
          autoIndex: true,
        },
        (error) => {
          if (error) return new Error("Failed to connect to database");
          console.log("connected");
        }
      );
    }

  } catch (error) {
    console.log(error);
  }
};


exports.close = ()=>{
   return mongoose.disconnect();
}