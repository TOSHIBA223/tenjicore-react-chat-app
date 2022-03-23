
// Create and Save a new users
var mysql = require('mysql');
var fs = require("fs");
const { encrypt, decrypt } = require('./crypto');

var con = process.env.NODE_ENV === 'production' ? 
    mysql.createConnection({
        host: "nba02whlntki5w2p.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "qu957f7kkhmublj9",
        password: "ohg9pbjrhvtyiwjp",
        database: "lc5t9qs9bfw8wxnt"
    }) : 
    mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "test"
    })

con.connect(function(err) {
    if (err) throw err;
});

exports.createUser = (req, res) => {
    var createQuery = 'CREATE TABLE IF NOT EXISTS users (type VARCHAR(50) DEFAULT "0",cName VARCHAR(50) DEFAULT "", cRepresentativeL VARCHAR(50) DEFAULT "", cRepresentativeF VARCHAR(50) DEFAULT "", cRepresentativeLK VARCHAR(50) DEFAULT "", cRepresentativeFK VARCHAR(50) DEFAULT "", cRequireNo VARCHAR(50) DEFAULT "", cEmail VARCHAR(50) DEFAULT "", cPass VARCHAR(50) DEFAULT "", uLname VARCHAR(50) DEFAULT "", uFname VARCHAR(50) DEFAULT "", uLnameK VARCHAR(50) DEFAULT "", uFnameK VARCHAR(50) DEFAULT "", uEmail VARCHAR(50) DEFAULT "", uTel VARCHAR(50) DEFAULT "", uPass VARCHAR(50) DEFAULT "", active VARCHAR(50) DEFAULT "1", role VARCHAR(50) DEFAULT "0", img VARCHAR(50) DEFAULT "")';
    con.query(createQuery, function(err,result){
        if(err) {console.log(err)}
    })
    if(req.body.type == "0") {
        var sql = "select * from users where cEmail = '"+req.body.cEmail+"'";
        con.query(sql, (err, result) => {
            if(result.length == 0) {
                var sqlquery = "INSERT INTO users (type, cName, cRepresentativeL, cRepresentativeF, cRepresentativeLK , cRepresentativeFK, cRequireNo, cEmail, uTel, cPass ) VALUES('"+req.body.type+"','"+req.body.cName+"','"+req.body.cRepresentativeLastname+"','"+req.body.cRepresentativeFirstname+"','"+req.body.cRepresentativeLastnameKana+"','"+req.body.cRepresentativeFirstnameKana+"','"+req.body.cRequiredNoofSeats+"','"+req.body.cEmail+"','"+req.body.cTel+"','"+JSON.stringify(encrypt(req.body.cPass))+"')";
                con.query(sqlquery, function (err, result1) {
                    if (err) throw err;
                    res.send('Success!');
                });
            } else {
                res.send('The user has already exist. Try again')
            }
        })
    } else if(req.body.type == "1") {
        var sql = "select * from users where uEmail = '"+req.body.uE+"'";
        con.query(sql, (err, result) => {
            if(result.length == 0) {
                var sqlquery = "INSERT INTO users (type, uLname, uFname, uLnameK, uFnameK , uEmail, uTel, uPass ) VALUES('"+req.body.type+"','"+req.body.uLastN+"','"+req.body.uFirstN+"','"+req.body.uLastNKana+"','"+req.body.uFirstNKana+"','"+req.body.uE+"','"+req.body.uTel+"','"+JSON.stringify(encrypt(req.body.uPass))+"')";
                con.query(sqlquery, function (err, result1) {
                    if (err) throw err;
                    res.send('Success!');
                });
            } else {
                res.send('The user has already exist. Try again')
            }
        })
    }
};

exports.SigninUser = (req, res) => {
    var createQuery = 'CREATE TABLE IF NOT EXISTS users (type VARCHAR(50) DEFAULT "0",cName VARCHAR(50) DEFAULT "", cRepresentativeL VARCHAR(50) DEFAULT "", cRepresentativeF VARCHAR(50) DEFAULT "", cRepresentativeLK VARCHAR(50) DEFAULT "", cRepresentativeFK VARCHAR(50) DEFAULT "", cRequireNo VARCHAR(50) DEFAULT "", cEmail VARCHAR(50) DEFAULT "", cPass VARCHAR(50) DEFAULT "", uLname VARCHAR(50) DEFAULT "", uFname VARCHAR(50) DEFAULT "", uLnameK VARCHAR(50) DEFAULT "", uFnameK VARCHAR(50) DEFAULT "", uEmail VARCHAR(50) DEFAULT "", uTel VARCHAR(50) DEFAULT "", uPass VARCHAR(50) DEFAULT "", active VARCHAR(50) DEFAULT "1", role VARCHAR(50) DEFAULT "0", img VARCHAR(50) DEFAULT "")';
    con.query(createQuery, function(err,result){
        if(err) {console.log(err)}
    })
    var sql = "select * from users where cEmail = '"+req.body.user_email+"' OR uEmail = '"+req.body.user_email+"'";
    con.query(sql, (err, result) => {
        if(result.length > 0) {
            if(result[0]['type'] == "0") {
                if(req.body.user_password == decrypt(JSON.parse(result[0]['cPass']))) {
                    res.send(result);
                } else {
                    res.send("Password was wrong!");
                }
            } else {
                if(req.body.user_password == decrypt(JSON.parse(result[0]['uPass']))) {
                    res.send(result);
                } else {
                    res.send("Password was wrong!");
                }
            }
        } else {
            res.send("The user doesn't exist. Please sign up!");
        }
    })
};

// // Find a single users with an id
exports.updateuser = (req, res) => {
    var updateField = ""
    var oldField = ""
    if(req.body['usertype'] == 0) {
        updateField = "cRepresentativeL"
        oldField = "cEmail"
    }
    else if(req.body['type'] == "img") {
        updateField = "img"
    } else {
        updateField = "uLname"
        oldField = "uEmail"
    }
    var query = "UPDATE users SET "+updateField+" = '"+req.body['name']+"' WHERE "+oldField+" = '"+req.body['email']+"'";
    con.query(query, (err, result) => {
        if(err) return err;
    })
};

// 
exports.updateinfoUser = (req, res) => {
    var sql = ''
    if(req.body['type'] == 0) {
        sql += "UPDATE users SET cName = '"+req.body['changedData'][0]+"', cRepresentativeL = '"+req.body['changedData'][1]+"', cRepresentativeF = '"+req.body['changedData'][2]+"', cRepresentativeLK = '"+req.body['changedData'][3]+"', cRepresentativeFK = '"+req.body['changedData'][4]+"', cRequireNo = '"+req.body['changedData'][5]+"', cEmail = '"+req.body['changedData'][6]+"', uTel = '"+req.body['changedData'][7]+"', active = '"+req.body['changedData'][8]+"', role = '"+req.body['changedData'][9]+"', cPass = '"+JSON.stringify(encrypt(req.body['changedData'][10]))+"' WHERE cEmail = '"+req.body['email']+"'";
    } else {
        sql += "UPDATE users SET uLname = '"+req.body['changedData'][0]+"', uFname = '"+req.body['changedData'][1]+"', uLnameK = '"+req.body['changedData'][2]+"', uFnameK = '"+req.body['changedData'][3]+"', uEmail = '"+req.body['changedData'][4]+"', uTel = '"+req.body['changedData'][5]+"', active = '"+req.body['changedData'][6]+"', role = '"+req.body['changedData'][7]+"', uPass = '"+JSON.stringify(encrypt(req.body['changedData'][8]))+"' WHERE uEmail = '"+req.body['email']+"'";
    }
    con.query(sql, (err, result) => {
        if(err) return err;
        res.send(true)
    })
};

// Remove USer
exports.removeUser = (req, res) => {
    console.log(req.body)
    var emails = req.body.emails
    var sql = "DELETE FROM users WHERE ";
    for(var i = 0 ; i < emails.length ; i++) {
        if(i == 0) {
            if(emails[i] != "") {
                sql += "cEmail = '"+emails[i]+"' OR uEmail = '"+emails[i]+"' ";
            }
        } else {
            if(emails[i] != "") {
                sql += "OR cEmail = '"+emails[i]+"' OR uEmail = '"+emails[i]+"' ";
            }
        }
    }
    con.query(sql, (err, result) => {
        if(err) return err;
        res.send(true)
    })
};

exports.imageUpload = (req, res) => {
    var oldField = ""
    if(req.body['type'] == "0") {
        oldField = "cEmail"
    } else {
        oldField = "uEmail"
    }
    if(req.files[0] != undefined) {
        var dateString = (new Date().valueOf())
        var partUrl = "/uploads/" + dateString + '.' + req.files[0]['originalname'].split('.')[req.files[0]['originalname'].split('.').length - 1]
        var fileUrl = 'build' + partUrl;
        fs.writeFile(fileUrl , req.files[0]['buffer'], function (err) {
            if (err) throw err;
            // fs.writeFile('public'+partUrl , req.files[0]['buffer'], function (err) {})
            var query = "UPDATE users SET img = '"+partUrl+"' WHERE "+oldField+" = '"+req.body['email']+"'";
            con.query(query, (err, result) => {
                if(err) return err;
                res.send('File is uploaded sccussfuly!-=~=-'+partUrl);
            })
        });
    } else {
        res.send("Select the correct image!-=~=-g")
    }
};

exports.loadUsers = (req, res) => {
    var oldField = ""
    if(req.body['type'] == "0") {
        oldField = "cEmail"
    } else {
        oldField = "uEmail"
    }
    con.query("SELECT * from users WHERE "+oldField+" != '"+req.body.email+"'", (err, result) => {
        if(err) throw err;
        for(var i = 0 ; i < result.length ; i++) {
            if(result[i]['uPass'] != "") {
                result[i]['uPass'] = decrypt(JSON.parse(result[i]['uPass']));
            }
            if(result[i]['cPass'] != "") {
                result[i]['cPass'] = decrypt(JSON.parse(result[i]['cPass']));
            }
        }
        res.send(result);
    })
}