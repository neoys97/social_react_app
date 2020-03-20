var express = require('express');
var cookieParser = require('cookie-parser'); 
var router = express.Router();
router.use(cookieParser());

var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getFromDB (db, table, key, value) {
    return new Promise(function (resolve, reject) {
        db.get(table).find({[key]:{$in:value}}, {fields:{}}, function(err, doc) {
            resolve (doc);
        });
    });
}

function getFormattedDateTime () {
    var d = new Date();
    var temp = d.getHours();
    var hour = temp >= 10 ? temp.toString() : "0" + temp.toString();
    temp = d.getMinutes();
    var min = temp >= 10 ? temp.toString() : "0" + temp.toString();
    temp = d.getSeconds();
    var sec = temp >= 10 ? temp.toString() : "0" + temp.toString();
    var day = days[d.getDay()];
    var month = months[d.getMonth()];
    temp = d.getDate();
    var date = temp >= 10 ? temp.toString() : "0" + temp.toString(); 
    var year = d.getFullYear().toString();
    var formattedDate = hour + ":" + min + ":" + sec + " " + day + " " + month + " " + date + " " + year;
    return (formattedDate);
}

function getDateTime(dateString) {
    var time = dateString.slice(0, 8);
    var date = dateString.slice(13, 24);
    var timeArray = time.split(':');
    var d = new Date(date);
    d.setHours(parseInt(timeArray[0]));
    d.setMinutes(parseInt(timeArray[1]));
    d.setSeconds(parseInt(timeArray[2]));
    return d;
}

/*
 * POST signin.
 */
router.post('/signin', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
    });  
    var db = req.db;
    var username = req.body.username;
    var password = req.body.password;
    db.get('userList').findOne({"name":username}, {fields:{}}, function(err, doc) {
        if (doc) {
            console.log(password);
            console.log(doc.password);
            if (doc.password == password) {
                if (doc) {
                    var user_id = doc._id;
                    var userInfo = "{\"name\":\""+doc.name+"\",\"_id\":\""+doc._id+"\",\"icon\":\""+doc.icon+"\",\"friends\":[";
                    var friends_id = [];
                    var i = 0;
                    for (var elem in doc.friends) {
                        friends_id.push(doc.friends[i].friendId);
                        i++;
                    }
    
                    getFromDB (db, "userList", "_id", friends_id).then(function(result){
                        var i = 0;
                        var temp = "";
                        for (var elem in result) {
                            var starred = "";
                            var j = 0;
                            for(var e in doc.friends) {
                                if (doc.friends[j].friendId == result[i]._id) {
                                    starred = doc.friends[j].starredOrNot;
                                    break;
                                }
                                j++
                            }
                            var temp = temp + "{\"_id\":\""+result[i]._id+"\",\"name\":\""+result[i].name+"\",\"icon\":\""+result[i].icon+"\",\"starredOrNot\":\""+starred+"\"},";
                            i ++;
                        }
                        temp = temp.substr(0, temp.length-1);
                        userInfo = userInfo + temp + "],";
                        friends_id.push(user_id.toString());
                        return (getFromDB (db, "postList", "userId", friends_id));
                    }).then(function(result){
                        userInfo = userInfo + "\"post\":[";
                        var i = 0;
                        var temp = "";
                        for (var elem in result) {
                            var temp = temp + "{\"_id\":\""+result[i]._id+"\",\"time\":\""+result[i].time+"\",\"userId\":\""+result[i].userId+"\",\"location\":\""+result[i].location+"\",\"content\":\""+result[i].content+"\",\"image\":\""+result[i].image+"\"},";
                            i ++;
                        }
                        temp = temp.substr(0, temp.length-1);
                        userInfo = userInfo + temp + "],";
    
                        return (getFromDB (db, "commentList", "userId", friends_id));
                    }).then(function(result){
                        userInfo = userInfo + "\"comment\":[";
                        var i = 0;
                        var temp = "";
                        for (var elem in result) {
                            if (!result[i].deleteTime)
                                var temp = temp + "{\"_id\":\""+result[i]._id+"\",\"name\":\""+result[i].userId+"\",\"time\":\""+result[i].postTime+"\",\"postId\":\""+result[i].postId+"\",\"content\":\""+result[i].comment+"\"},";
                            i ++;
                        }
                        temp = temp.substr(0, temp.length-1);
                        userInfo = userInfo + temp + "]}";
                        res.cookie('userId', doc._id, {httpOnly: false});
                        res.send(userInfo);
                    });
                    
                    db.get('userList').update({'_id':user_id}, {$set:{'lastCommentRetrievalTime':getFormattedDateTime()}}, function(err, doc) {
                        if (err)
                            console.log("Error updating the last comment retrieval date.");
                    });
                }
                else {
                    res.send("");
                }
            }
            else {
                console.log("Login unsuccessful");
                res.send(err);
            }
        }
        else {
            res.send(err);
        }
    });
  });

/* 
 * GET logout
 */
router.get('/logout', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
    });  
    if (req.cookies.userId) {
        res.clearCookie('userId');
        res.send('');
    } 
});

/* 
 * GET user profile
 */
router.get('/getuserprofile', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
    });  
    var db = req.db;
    var userId = req.cookies.userId;
    if (userId) {
        db.get('userList').findOne({'_id':userId}, {fields:{'mobileNumber':1, 'homeNumber':1, 'address':1}}, function(err, doc) {
            if (doc) {
                var userProfile = "{\"mobileNumber\":\"" + doc.mobileNumber + "\",\"homeNumber\":\"" + doc.homeNumber + "\",\"address\":\"" + doc.address + "\"}";
                res.send(userProfile);
            }
            else {
                res.send(err);
            }
        });
    }
});

/* 
 * PUT update user profile
 */
router.put('/saveuserprofile', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
    });  
    var db = req.db;
    var userId = req.cookies.userId;
    var mobileNumber = req.body.mobileNumber;
    var homeNumber = req.body.homeNumber;
    var address = req.body.address;
    if (userId) {
        db.get('userList').update({'_id':userId}, {$set:{'mobileNumber':mobileNumber, 'homeNumber':homeNumber, 'address':address}}, function(err, doc) {
            if (err)
                res.send(err);
            else   
                res.send('');
        });
    }
});

/* 
 * GET update friend star
 */
router.get('/updatestar/:friendid', function(req, res) { 
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
    });  
    var db = req.db;
    var userId = req.cookies.userId;
    if (userId) {
        db.get('userList').findOne({'_id':userId, 'friends.friendId':req.params.friendid}, {fields:{'friends.$.starredOrNot':1}}, function(err, doc) {
            if (doc) {
                db.get('userList').update({'_id':userId, 'friends.friendId':req.params.friendid}, {$set:{'friends.$.starredOrNot': (doc.friends[0].starredOrNot == 'Y' ? 'N' : 'Y')}}, function(err, doc) {
                    if (doc) {
                        res.send("");
                    }
                    else  
                        res.send(err);
                });
            }
            else {
                res.send(err);
            }
        });
    }
});

/* 
 * POST post comment
 */
router.post('/postcomment/:postid', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
    });  
    var db = req.db;
    var userId = req.cookies.userId;
    var comment = req.body.comment;
    var postId = req.params.postid;
    if (userId) {
        db.get('commentList').insert({'postId':postId,'userId':userId, 'postTime':getFormattedDateTime(), 'comment':comment, 'deleteTime':''}, function(err, doc){
            if (err)
                res.send(err);
            else
                res.send('');
        });
    }
});

/* 
 * DELETE delete comment
 */
router.delete('/deletecomment/:commentid', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
    });  
    var db = req.db;
    db.get('commentList').update({'_id':req.params.commentid}, {$set:{'deleteTime':getFormattedDateTime()}}, function (err, doc) {
        if (err)
            res.send(err);
        else
            res.send('');
    });
});

/* 
 * GET load comment updates
 */
router.get('/loadcommentupdates', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
    });  
    var db = req.db;
    var userId = req.cookies.userId;
    if (userId) {
        db.get('userList').findOne({'_id':userId}, {fields:{'friends':1, 'lastCommentRetrievalTime':1}}, function(err, doc) {
            if (doc){
                var friends_id = [];
                var i = 0;
                for (var elem in doc.friends) {
                    friends_id.push(doc.friends[i].friendId);
                    i ++
                }
                friends_id.push(userId.toString());
                var lastCommentRetrive = getDateTime(doc.lastCommentRetrievalTime); 
                getFromDB (db, "commentList", "userId", friends_id).then(function(result){
                    var i = 0;
                    var newComments = "\"comments\":[";
                    var deleteComments = "\"delcomments\":[";
                    var chgNew = false;
                    var chgDel = false;
                    for (var elem in result) {
                        if (result[i].deleteTime == '') {
                            var currentTime = getDateTime(result[i].postTime);
                            if (currentTime >= lastCommentRetrive) {
                                chgNew = true;
                                var temp = "{\"_id\":\"" + result[i]._id + "\",\"postId\":\"" + result[i].postId + "\",\"name\":\"" + result[i].userId + "\",\"time\":\"" + result[i].postTime + "\",\"content\":\"" + result[i].comment + "\"},";
                                newComments = newComments + temp;
                            }
                        }
                        else {
                            var deleteTime = getDateTime(result[i].deleteTime);
                            if (deleteTime >= lastCommentRetrive) {
                                chgDel = true;
                                deleteComments = deleteComments + "\"" + result[i]._id + "\",";
                            }
                        }
                        i ++;
                    }
                    if (chgNew)
                        newComments = newComments.substr(0, newComments.length-1);
                    newComments = newComments + ']';
                    
                    if (chgDel)
                        deleteComments = deleteComments.substr(0, deleteComments.length-1);
                    deleteComments = deleteComments + ']';

                    db.get('userList').update({'_id':userId}, {$set:{'lastCommentRetrievalTime':getFormattedDateTime()}}, function(err, doc) {
                        if (err)
                            console.log("Error updating the last comment retrieval date.");
                    });

                    res.send("{" + newComments + "," + deleteComments + "}");
                });
            }
            else {
                res.send(err);
            }
        });
    }
    else {
        res.send("{\"comments\":[],\"delcomments\":[]}");
    }
});

/* 
 * GET check cookie set
 */
router.get('/checkcookie', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
    });  
    var db = req.db;
    if (req.cookies.userId) {
        db.get('userList').findOne({"_id":req.cookies.userId}, {fields:{}}, function(err, doc) {
            if (doc) {
                var user_id = doc._id;
                var userInfo = "{\"name\":\""+doc.name+"\",\"_id\":\""+doc._id+"\",\"icon\":\""+doc.icon+"\",\"friends\":[";
                var friends_id = [];
                var i = 0;
                for (var elem in doc.friends) {
                    friends_id.push(doc.friends[i].friendId);
                    i++;
                }

                getFromDB (db, "userList", "_id", friends_id).then(function(result){
                    var i = 0;
                    var temp = "";
                    for (var elem in result) {
                        var starred = "";
                        var j = 0;
                        for(var e in doc.friends) {
                            if (doc.friends[j].friendId == result[i]._id) {
                                starred = doc.friends[j].starredOrNot;
                                break;
                            }
                            j++
                        }
                        var temp = temp + "{\"_id\":\""+result[i]._id+"\",\"name\":\""+result[i].name+"\",\"icon\":\""+result[i].icon+"\",\"starredOrNot\":\""+starred+"\"},";
                        i ++;
                    }
                    temp = temp.substr(0, temp.length-1);
                    userInfo = userInfo + temp + "],";
                    friends_id.push(user_id.toString());
                    return (getFromDB (db, "postList", "userId", friends_id));
                }).then(function(result){
                    userInfo = userInfo + "\"post\":[";
                    var i = 0;
                    var temp = "";
                    for (var elem in result) {
                        var temp = temp + "{\"_id\":\""+result[i]._id+"\",\"time\":\""+result[i].time+"\",\"userId\":\""+result[i].userId+"\",\"location\":\""+result[i].location+"\",\"content\":\""+result[i].content+"\",\"image\":\""+result[i].image+"\"},";
                        i ++;
                    }
                    temp = temp.substr(0, temp.length-1);
                    userInfo = userInfo + temp + "],";

                    return (getFromDB (db, "commentList", "userId", friends_id));
                }).then(function(result){
                    userInfo = userInfo + "\"comment\":[";
                    var i = 0;
                    var temp = "";
                    for (var elem in result) {
                        if (!result[i].deleteTime)
                            var temp = temp + "{\"_id\":\""+result[i]._id+"\",\"name\":\""+result[i].userId+"\",\"time\":\""+result[i].postTime+"\",\"postId\":\""+result[i].postId+"\",\"content\":\""+result[i].comment+"\"},";
                        i ++;
                    }
                    temp = temp.substr(0, temp.length-1);
                    userInfo = userInfo + temp + "]}";
                    res.cookie('userId', doc._id, {httpOnly: false});
                    res.send(userInfo);
                });
                
                db.get('userList').update({'_id':user_id}, {$set:{'lastCommentRetrievalTime':getFormattedDateTime()}}, function(err, doc) {
                    if (err)
                        console.log("Error updating the last comment retrieval date.");
                });
            }
            else {
                res.send("");
            }
        });
    }
    else {
        res.send("");
    }
});

/*
 * Handle preflighted request
 */
router.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.send(200);
});

module.exports = router;
