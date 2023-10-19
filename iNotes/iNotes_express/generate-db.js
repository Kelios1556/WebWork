var conn = new Mongo();
var db = conn.getDB("assignment2");

var user_name = ['Ajimita', 'Ceylon', 'Kio', 'Skade'];
var user_pwd = ['1', '2', '3', '4'];
var user_icon = ['./images/Ajimita.jpg', './images/Ceylon.jpg', './images/Kio.jpg', './images/Skade.jpg'];


db.userList.remove({});

for (let i = 0; i < user_name.length; i++) {
    db.userList.insert(
        {
            'name': user_name[i],
            'password': user_pwd[i],
            'icon': user_icon[i]
        }
    );
}

var user_id = [];

for (let i = 0; i < user_name.length; i++) {
    user_id.push(db.userList.find({name: user_name[i]})[0]["_id"].str);
}

db.noteList.remove({});

var notesavedtime = [
    [
        '20:12:10 Tue Nov 15 2022', 
        '21:32:05 Wed Nov 16 2022', 
        '08:09:15 Tue Nov 22 2022'
    ],
    [
        '14:57:09 Mon Dec 05 2022', 
        '03:08:02 Sat Dec 03 2022'
    ],
    [
        '07:12:10 Sat Oct 01 2022', 
        '11:32:05 Wed Oct 12 2022', 
        '18:49:27 Tue Oct 24 2022', 
        '00:12:10 Tue Nov 15 2022', 
        '15:32:05 Wed Nov 16 2022', 
        '08:09:15 Tue Nov 22 2022'
    ],
    [
        '10:42:10 Fri Nov 25 2022'
    ]
];

var notestitle = [
    [
        'No.20181115',
        'No.20221202',
        '夕桜'
    ],
    [
        'nightingale',
        'qwqq'
    ],
    [
        'Gulf of Alaska',
        'Alps',
        'Syberia',
        'mathematics',
        'computer science',
        'Latanes'
    ],
    [
        'Gummy'
    ]
];

var notescontent = [
    [
        'Sunset',
        'black and white',
        'girl'
    ],
    [
        'prison',
        'cute!'
    ],
    [
        'mysterious',
        'ice',
        'splendid',
        'aaa',
        'bbb',
        'cool'
    ],
    [
        'love you~'
    ]
];


for (let i = 0; i < user_id.length; i++) {
    for (let j = 0; j < notesavedtime[i].length; j++) {
        db.noteList.insert(
            {
                'userId': user_id[i],
                'lastsavedtime': notesavedtime[i][j],
                'title': notestitle[i][j],
                'content': notescontent[i][j]
            }
        );
    }
}

