var conn = new Mongo();
var db = conn.getDB("album-db");

var usernames = ["Mc", "KFC", "Starbucks"]
var passwords = ["p1", "p2", "p3"]
var friendsList = [
    ['KFC', 'Starbucks'],
    ['Mc', 'Starbucks'],
    ['Mc', 'KFC']
]

db.userList.remove({});

for (let i=0; i < usernames.length; i++) {
    db.userList.insert(
        {
            'username':usernames[i], 
            'password':passwords[i],
            'friends':friendsList[i]
        }
    )
}

var ids = [];
for (let i = 0; i < usernames.length; i++) {
    ids.push(db.userList.find({username: usernames[i]})[0]["_id"].str);
}


db.mediaList.remove({});

for (let i = 1; i <= 13; i++) {
    db.mediaList.insert({'url': 'http://localhost:8081/media/' + i + '.jpg', 'userid': ids[0], 'likedby':[]});
}

for (let i = 14; i <= 17; i++) {
    db.mediaList.insert({'url': 'http://localhost:8081/media/' + i + '.jpg', 'userid': ids[1], 'likedby':[]});
}

for (let i = 18; i <= 25; i++) {
    db.mediaList.insert({'url': 'http://localhost:8081/media/' + i + '.jpg', 'userid': ids[2], 'likedby':[]});
}


