module.exports = {
 
    loginValidation:function validUser(users){
        const validEmail = typeof users.email == "string"
         && users.email.trim() != "";
        const validPassword = typeof users.password == "string"
         && users.password.trim() != "" && 
         users.password.trim().length >= 6;
         return validEmail && validPassword;
        },
    
    signupValidation:function validateNewUser(user){
        const validFirstname = typeof user.first_name == "string"
        && user.first_name.trim() != "";
        const validLastname = typeof user.last_name == "string"
        && user.last_name.trim() != "";
        const validEmail = typeof user.email == "string"
        && user.email.trim() != "";
        const validJobrole = typeof user.job_role == "string"
        && user.job_role.trim() != "";
        const validDepartment = typeof user.department == "string"
        && user.department.trim() != "";
        const validAddress = typeof user.address == "string"
        && user.address.trim() != "";
        const validPassword = typeof user.password == "string"
        && user.password.trim() != "" && user.password.trim().length >= 6;
        const validGender = typeof user.gender === "string"
        && user.gender.trim() != ""; 
    
        return validFirstname && validLastname && validEmail && validJobrole && validDepartment && validAddress && validPassword && validGender;
    },
    articleValidation:function validArticle(article){
        const validTitle = typeof article.title == "string" 
        && article.title.trim() != "";
        const validArticle = typeof article.article == "string"
        && article.article.trim() != "";
        return validTitle && validArticle;
    },
    gifValidation:function validGif(gif){
        const validTitle = typeof gif.title == "string" 
        && gif.title.trim() != "";
        const validurl = typeof gif.url == "string"
        && gif.url.trim() != "";
        return validTitle && validurl;

    }
    

}