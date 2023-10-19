var express = require('express');
var router = express.Router();

var monk = require('monk');

function getDate() {
  const date = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    month: 'short',
    day: '2-digit',    
    year: 'numeric',
    hour12: false 
  };
  let formattedData = date.toLocaleString('en-HK', options);
  let time = formattedData.slice(-8, );
  let weekday = formattedData.slice(0, 3);
  let month = formattedData.slice(8, 11);
  let day = formattedData.slice(5, 7);
  let year = formattedData.slice(12, 16);
  let finalTime = time + ' ' + weekday + ' ' + month + ' ' + day + ' ' + year;
  return finalTime;
}

router.post('/signin', (req, res) => {
  var db = req.db;
  var username = req.body.userName;
  var userpwd = req.body.password;
  var usercollection = db.get('userList');
  var notescollection = db.get('noteList');
  usercollection.find({name: username, password: userpwd}).then((docs) => {
    if (docs.length > 0) {
      var id = docs[0]['_id'];
      req.session.userId = id.toString();
      var icon = docs[0]['icon'];
      notescollection.find({userId: id.toString()}, {fields: "_id lastsavedtime title"}).then((docs_) => {
        var result = {
          'name': username,
          'icon': icon,
          'notes': docs_
        };
        res.json(result);
      }).catch((err) => {
        res.send({msg: err});
      });
      
    } else {
      res.send({msg: 'Login failure'});
    }
  }).catch((err) => {
    res.send({msg: err});
  });
});

router.get('/logout', (req, res) => {
  req.session.userId = null;
  res.send();
});

router.get('/getnote', (req,res) => {
  var noteid = req.query.noteid;
  var db = req.db;
  var collection = db.get('noteList');
  collection.find({_id: monk.id(noteid)}, {field: {"_id": 1, "lastsavedtime": 1, "title": 1, "content": 1}}).then((docs) => {
    res.json(docs[0]);
  }).catch((err) => {
    res.send({msg: err});
  });
});

router.post('/addnote', (req, res) => {
  var title = req.body.title;
  var content = req.body.content;
  var userid = req.session.userId;
  var db = req.db;
  var collection = db.get('noteList');
 
  let time = getDate();

  collection.insert(
    {
      'userId': userid,
      'lastsavedtime': time,
      'title': title,
      'content': content
    }
  ).then((docs) => {
    var id = docs["_id"];
    var lastsavedtime = docs["lastsavedtime"];
    res.json({_id: id, lastsavedtime: lastsavedtime});
  }).catch((err) => {
    res.send({msg: err});
  });
});

router.put('/savenote/:noteid', (req, res) => {
  var noteid = req.params.noteid;
  var db = req.db;
  var collection = db.get('noteList');
  var title = req.body.title;
  var content = req.body.content;
  var time = getDate();
  collection.update({_id: monk.id(noteid)}, {$set: 
    {
      lastsavedtime: time, 
      title: title, 
      content: content
    }
  }).then(() => {
    res.json({lastsavedtime: time});
  }).catch((err) => {
    res.send({msg: err});
  });
});

router.get('/searchnotes', (req, res) => {
  var searchstr = req.query.searchstr;
  var db = req.db;
  var collection = db.get('noteList');
  var userId = req.session.userId;
  collection.find({userId: userId}).then((docs) => {
    var marched = docs.filter(note => note["title"].includes(searchstr) || note["content"].includes(searchstr));
    delete marched["userId"];
    delete marched["content"];
    res.json(marched);
  }).catch((err) => {
    res.send({msg: err});
  });
});

router.delete('/deletenote/:noteid', (req, res) => {
  var db = req.db;
  var collection = db.get('noteList');
  var noteId = req.params.noteid;
  collection.remove({_id: monk.id(noteId)}).then(() => {
    res.send();
  }).catch((err) => {
    res.send({msg: err});
  });
});

module.exports = router;