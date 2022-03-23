const multer = require("multer"); 
module.exports = app => {
    const users = require("./controllers/users.controller.js");

    var router = require("express").Router();

    // Create a new users
    // router.post("/createUser", users.createUser);
    router.post("/createUser", users.createUser);
    
    // signin
    router.post("/SigninUser", users.SigninUser);
    
    // user name change
    router.post("/updateuser", users.updateuser);
    // router.get("/", users.first);
    router.post("/loadUsers", users.loadUsers);
    
    // router.post("/imageUpload", users.imageUpload);
    router.post("/imageUpload", multer().any() , users.imageUpload);

    // Remove Users
    router.post("/removeUser", users.removeUser);

    // Update Users
    router.post("/updateinfoUser", users.updateinfoUser);

    app.use('/tenji-con/', router);
};