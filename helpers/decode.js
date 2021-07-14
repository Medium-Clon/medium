const jwt = require("jsonwebtoken");
const {Secret} = require("./keys")
    
exports.decode = ()=>{ const bearerHeader = req.headers["authorization"];
     const token = bearerHeader && bearerHeader.split(" ")[1]
     let decode = jwt.verify(token,Secret).email; 
     return decode;
     //console.log(decode)
    }