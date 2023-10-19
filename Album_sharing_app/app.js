var express = require('express');
var app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

var monk = require('monk');
var db = monk('127.0.0.1:27017/album-db');

const max_media = 6;

app.use(express.static('public'), function(req,res,next){	
  req.db = db;
  next();
})




app.get('/load', (req, res) => {
  var db = req.db;
  var collection = db.get('userList');
  if (req.cookies.user_id) {

    collection.find({_id: monk.id(req.cookies.user_id)}).then((docs) => {
      var userName = docs[0].username;
      var friends = docs[0].friends;
      collection.find({username: {$in: friends}}, {fields: {"_id": 1}}).then((docs_) => {
        var loadResult = {"username": userName, "friendsusername": friends, "friendsId": docs_};
        res.json(loadResult);

      })
    }).catch((err) => {
      res.send(err);
    })
  } else {
    res.send();
  }
})


app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  var username_ = req.body.userName;
  var pwd = req.body.password;

  var db = req.db;
  var collection = db.get('userList');
  
  collection.find({username: username_, password: pwd}).then((docs) => {
    if (docs.length >= 1) {
      var id = docs[0]['_id'].toString();
      //var name = user['username'];
      var friends = docs[0]['friends'];
      res.cookie('user_id', id, {maxAge: 30 * 60 * 1000});
      collection.find({username: {$in: friends}}, {fields: {"_id": 1}}).then((docs_) => {
        var loginResult = {"friendsusername": friends, "friendsId": docs_};
        res.json(loginResult);
      })
      
    } else {
      res.send('Login failure');
    }
  }).catch((err) => {
    res.send(err);
  })
}) 


app.get('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.send();
})


app.get('/getalbum', (req, res) => {
  var id = req.query.userid;
  var pagenum = req.query.pagenum;
  if (id == '0') {
    id = req.cookies.user_id; 
  }
  var db = req.db;
  var collection = db.get('mediaList');
  collection.find({userid: id}).then((docs) => {
    collection.find({userid: id}, {skip: pagenum * max_media, limit: max_media}).then((docs_) => {
      var getalbumResult = {
          "mediasInfo": docs_,
          "totalPage": Math.floor((Math.max(0, docs.length - 1)) / max_media)
      };
      res.json(getalbumResult);
    })
  }).catch ((err) => {
    res.send(err);
  })

})


app.post('/postlike', express.urlencoded({ extended: true }), (req, res) => {
  var id = req.cookies.user_id;
  var mediaid = req.body.photovideoid;
  var db = req.db;
  var user_collection = db.get('userList');
  var media_collection = db.get('mediaList');
  var likedby;
  user_collection.find({_id: monk.id(id)}).then((docs) => {
    var username = docs[0].username;
    media_collection.find({_id: monk.id(mediaid)}).then((docs_) => {
      likedby = docs_[0].likedby;
      if (!likedby.includes(username)) {
        likedby.push(username);
        media_collection.update({_id: monk.id(mediaid)}, {$set: {likedby: likedby}}).then(() => {
          res.json({'_': likedby});
        }).catch((err) => {
          res.send(err);
        })
      }
    }).catch((err) => {
      res.send(err);
    })
  })
})

var server = app.listen(8081, () => {
	var host = server.address().address
	var port = server.address().port
	console.log("lab5 app listening at http://%s:%s", host, port)
});
