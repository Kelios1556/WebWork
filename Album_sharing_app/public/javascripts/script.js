function highlightPickUser(id) {
    var alluser = document.getElementById("albumList");
    for (let i of Array.from(alluser.children)) {
        if (i.id != id) {
            i.removeAttribute("style", "background-color:cadetblue");
        } else {
            i.setAttribute("style", "background-color:cadetblue"); 
        }
    }
}

function mediaKind(s) {
    if (s.slice(-3) == 'mp4') {
        return "vedio";
    } else {
        return "img";
    }
}

function printlike(result) {
    let temy = '';
    if (typeof(result) == 'string') 
        return result;
    for (let i = 0; i < result.length; i++) {
        temy += result[i];
        if (i != result.length - 1) {
            temy += ', ';
        }
    }
    return temy;
}

function init() {

    document.getElementById("loginMessage").style.display = 'none';  
    var xml = new XMLHttpRequest();

    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var response = xml.responseText;
            if (response !== '') {
                var response = JSON.parse(response);
                var userName = response["username"];
                document.getElementById("loginMessage").style.display = '';  
                document.getElementById("loginMessageContent").innerHTML = 'Hello ' + userName + '!';
                /*loginIn.innerHTML = "Hello " + userName + "!";
                let x = document.createElement("button");
                x.innerHTML = "log out";
                x.setAttribute("id", "logout");
                x.setAttribute("onclick", "logout()");*/

                document.getElementById("toLoginIn").style.display = 'none';
                //loginIn.appendChild(x);

                var friendsList = response["friendsusername"];
                var friendsId = response["friendsId"];
                var albumList = document.getElementById("albumList");
                var xx = document.createElement('div');
                xx.setAttribute("id", '0');
                xx.setAttribute("onclick", "loadAlbum(event, 0)");
                xx.setAttribute("class", "albumlist");
                xx.setAttribute("name", userName);
                xx.innerHTML = "My Album";
                albumList.appendChild(xx);
                for (let i = 0; i < friendsList.length; i++) {
                    var xx = document.createElement("div");
                    xx.innerHTML = friendsList[i] + "'s Album";
                    xx.setAttribute("id", friendsId[i]["_id"].toString());
                    xx.setAttribute("name", friendsList[i]);
                    xx.setAttribute("onclick", "loadAlbum(event, 0)");
                    xx.setAttribute("class", "albumlist");
                    albumList.appendChild(xx);
                }
            } else {
                document.getElementById("loginMessage").style.display = 'none'; 
            }
        }
    }
    xml.open('GET', "/load", true);
    xml.send();
}

function login() {
    var name = document.getElementById("userName").value;
    var password = document.getElementById("userPassword").value;
    if (name == '' || password == '') {
        alert("Please enter username and password");
        return;
    }


    var xml = new XMLHttpRequest();

    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var r = xml.responseText;
            if (r == 'Login failure') {
                alert('Login failure');
                return;
            } else {
                r = JSON.parse(r);
                document.getElementById("toLoginIn").style.display = 'none';
                document.getElementById("loginMessage").style.display = '';  
                document.getElementById("loginMessageContent").innerHTML = 'Hello ' + name + '!';
                /*let x = document.createElement("button");
                x.innerHTML = "log out";
                x.setAttribute("id", "logout");
                x.setAttribute("onclick", "logout()");
                document.getElementById("loginMessage").appendChild(x);*/

                let albumList = document.getElementById("albumList");
                let mediaGallary = document.getElementById("mediaGallary");

                var friendsName = r["friendsusername"];
                var friendsId = r.friendsId;
                for (let i of Array.from(friendsName)) {
                    localStorage.setItem(i, '0');
                }
                var xx = document.createElement('div');
                xx.setAttribute("id", '0');
                localStorage.setItem(name, 0);
                xx.setAttribute("onclick", "loadAlbum(event, 0)");
                xx.setAttribute("class", "albumlist");
                xx.setAttribute("name", name);
                xx.innerHTML = "My Album";
                albumList.appendChild(xx);
                for (let i = 0; i < friendsName.length; i++) {
                    var xx = document.createElement('div');
                    xx.setAttribute("id", friendsId[i]["_id"].toString());
                    xx.setAttribute("name", friendsName[i]);
                    xx.setAttribute("onclick", "loadAlbum(event, 0)");
                    xx.innerHTML = friendsName[i] + "'s Album";
                    xx.setAttribute("class", "albumlist");
                    localStorage.setItem(friendsName[i], '0');
                    albumList.appendChild(xx);
                }

            }
        }
    }

    xml.open('post', '/login', true);
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xml.send("userName="+name+"&password="+password);

}

function logout() {
    var xml = new XMLHttpRequest();

    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var r = xml.responseText; 
            if (r == '') {
                localStorage.clear();
                document.getElementById("loginMessage").style.display = 'none';
                /*loginIn.innerHTML = '';
                loginIn.removeChild(document.getElementById("logout"));
                document.getElementById("loginMessage").innerHTML = '';*/

                document.getElementById("toLoginIn").style.display = '';
                let albumList = document.getElementById("albumList");
                let mediaGallary = document.getElementById("mediaGallary");
                while (albumList.firstChild) {
                    albumList.removeChild(albumList.firstChild);
                }
                while (mediaGallary.firstChild) {
                    mediaGallary.removeChild(mediaGallary.firstChild);
                }
            }
        }
    }
    xml.open('GET', "/logout", true);
    xml.send();
}

function loadAlbum(e, viewpage) {
    var clickid = e.target.id;
    
    localStorage.setItem(currentviewing, viewpage);
    if (typeof(viewpage) != 'number') {
        viewpage = parseInt(viewpage);
    }
    highlightPickUser(clickid);
    var currentviewing = e.target.name;
    
    var xml = new XMLHttpRequest();
    var gallary = document.getElementById("mediaGallary");
    while (gallary.firstChild) {
        gallary.removeChild(gallary.firstChild);
    }
    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var rr = xml.responseText;
            rr = JSON.parse(rr);
            var r = rr["mediasInfo"];
            for (let i = 0; i < r.length; i++) {
                let dd = document.createElement("div");
                dd.setAttribute("class", "nobr1");
                dd.setAttribute("width", "20%");
                dd.setAttribute("id", "Gallery"+i);
                dd.setAttribute("name", currentviewing);
                if (mediaKind(r[i]["url"]) == "img") {
                    var mm = document.createElement("img");
                    mm.setAttribute("src", r[i]["url"]);
                    mm.setAttribute("id", r[i]["_id"]);
                    mm.setAttribute("name", clickid);
                    mm.setAttribute("type", "img");
                    mm.setAttribute("width", "100px");
                    mm.setAttribute("onclick", "displayPhoto(event)");
                } else {
                    var mm = document.createElement("video");
                    mm.setAttribute("src", r[i]["url"]);
                    mm.setAttribute("id", r[i]["_id"]);
                    mm.setAttribute("type", "video");
                    mm.setAttribute("name", clickid);
                    mm.setAttribute("controls", "controls");
                    mm.setAttribute("width", "100px");
                    mm.setAttribute("onclick", "displayPhoto(event)"); 
                }
                dd.appendChild(mm);

                var likestring = document.createElement('div');
                likestring.setAttribute("id", "likestring");

                if (r[i]["likedby"] != null) {
                    if (r[i]["likedby"].length > 0) {
                        likestring.innerHTML = printlike(r[i]["likedby"]) + " liked this photo!";
                    }
                }

                dd.appendChild(likestring);
                let bb = document.createElement("button");
                bb.setAttribute("class", "likeButton");
                bb.setAttribute("id", r[i]["_id"]);
                bb.setAttribute("onclick", "handleLike(event)");
                bb.innerHTML = "Like";
                dd.appendChild(bb);

                gallary.appendChild(dd);
            }

            var totalPage = rr["totalPage"];
            var previousButton = document.createElement("button");
            var nextButton = document.createElement("button");
            previousButton.innerHTML = '< previous';
            nextButton.innerHTML = "next >";
            previousButton.setAttribute("id", clickid);
            nextButton.setAttribute("id", clickid);
            previousButton.setAttribute("name", currentviewing);
            nextButton.setAttribute("name", currentviewing);
            let tt = parseInt(localStorage.getItem(currentviewing)) - 1;
            let ttt = parseInt(localStorage.getItem(currentviewing)) + 1; 
            previousButton.setAttribute("onclick", "loadAlbum(event, "+tt+")");
            nextButton.setAttribute("onclick", "loadAlbum(event, "+ttt+")");
            let divbb = document.createElement("div");
            divbb.setAttribute("id", "previousnext"); 
            if (viewpage == totalPage && totalPage > 0) {
                divbb.appendChild(previousButton);
            } else if (viewpage == 0 && totalPage > 0) {
                divbb.appendChild(nextButton);
            } else if (viewpage > 0 && viewpage < totalPage) {
                divbb.appendChild(previousButton);
                divbb.appendChild(nextButton);
            }
            gallary.appendChild(divbb);
        }
    }
    xml.open("GET", "getalbum?userid="+clickid+"&pagenum="+viewpage, true);
    xml.send();
}

function displayPhoto(e) {
    var gallary = document.getElementById("mediaGallary");
    var likes = e.target.parentElement.querySelector("#likestring").innerHTML;
    var belongsto = e.target.name;
    var belongstoName = document.getElementById("albumList").querySelector("[id='"+belongsto+"']").getAttribute("name");
    while (gallary.firstChild) {
        gallary.removeChild(gallary.firstChild);
    }
    var divx = document.createElement("div");
    divx.setAttribute("id", belongsto);
    divx.innerHTML = 'X';
    divx.setAttribute("onclick", "loadAlbum(event, "+localStorage.getItem(belongstoName)+")");
    gallary.appendChild(divx);

    var bigmedia;
    if (mediaKind(e.target.src) == 'img') {
        bigmedia = document.createElement("img");
    } else {
        bigmedia = document.createElement("vedio"); 
        bigmedia.setAttribute("controls", "controls");
    }
    bigmedia.setAttribute("src", e.target.src);
    bigmedia.setAttribute("width", "200px");
    gallary.appendChild(bigmedia);

    var biglikestring = document.createElement('div');
    biglikestring.innerHTML = likes;
    biglikestring.setAttribute("id", "likestring");

    gallary.appendChild(biglikestring);
    var lbutton = document.createElement("button");
    lbutton.setAttribute("class", "likeButton");
    lbutton.setAttribute("onclick", "handleLike(event)");
    lbutton.setAttribute("id", e.target.id);
    lbutton.innerHTML = "Like";
    gallary.appendChild(lbutton);
}

function handleLike(e) {
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var result = xml.responseText;
            result = JSON.parse(result);
            
            var temy = printlike(result["_"]);
            
            e.target.parentElement.querySelector("#likestring").innerHTML = temy + ' liked this photo!'; 
        }

    }
    xml.open('post', '/postlike', true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send("photovideoid="+e.target.id);
}