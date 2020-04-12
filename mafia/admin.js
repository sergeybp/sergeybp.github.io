var config = {
    apiKey: "AIzaSyC4iwQ4faPC885nmKOBkpZKJ6VEPs75IcM",
    authDomain: "elostats-5b95d.firebaseapp.com",
    databaseURL: "https://elostats-5b95d.firebaseio.com",
    projectId: "elostats-5b95d",
    storageBucket: "elostats-5b95d.appspot.com",
    messagingSenderId: "528242988488"
};
firebase.initializeApp(config);
setInterval(function(){mainCycle(); }, 3000);
window.onload = function exampleFunction() {
    mainCycle();
};

function createNewGame() {
    var gameId = document.getElementById('gameId').value;
    firebase.database().ref('mafia/games').child(gameId).set({
        gameId: gameId,
        gameName: document.getElementById('gameName').value
    });
    sessionStorage.setItem("currentGameId", document.getElementById('gameId').value);
    sessionStorage.setItem("currentGameName", document.getElementById('gameName').value);
    setCurrentGameName();
}

function getActiveGameId() {
    return sessionStorage.getItem("currentGameId");
}

function commonClear() {
    var currentRound = parseInt(sessionStorage.getItem("currentRound") || "0") || 0;
    firebase.database().ref('mafia/games').child(getActiveGameId()).update({
        currentRound: currentRound + 1
    });
    sessionStorage.setItem("currentRound", currentRound + 1);
    var users = sessionStorage.getItem("users").split("|");
    for(var i = 0; i < users.length; i++) {
        sessionStorage.removeItem(users[i] + "-" + 1 + "color");
        sessionStorage.removeItem(users[i] + "-" + 2 + "color");
        sessionStorage.removeItem(users[i] + "-" + 3 + "color");
        sessionStorage.removeItem(users[i] + "-" + 4 + "color");
    }

}

function genCurrentGame() {

    var currentRound = sessionStorage.getItem("currentRound") || "Press Falling asleep to start round.";
    if(gameStarted()) {
        var sBuilder = "Current round: " + currentRound + "<br>";
        sBuilder += "<button onclick=\"commonClear();\" style=\"background-color:darkgreen;color:white\">Falling asleep</button><br>";
        sBuilder += "Don't forget: <br>";
        sBuilder += "The mafia wakes up <br>";
        sBuilder += "The commissar wakes up <br>";
        sBuilder += "The woman wakes up <br>";
        sBuilder += "The maniac wakes up <br>";
        sBuilder += "The doctor wakes up <br>";
        return sBuilder;
    } else {
        return "";
    }
}

function setCurrentGameName() {
    document.getElementById("currentGameLabel").textContent = "Active game: " +  sessionStorage.getItem("currentGameName") + ' ('+getActiveGameId()+')';
    if((sessionStorage.getItem("gameStarted") || "no") === "yes") {
        document.getElementById("assignRoles").style.visibility = "hidden";
        document.getElementById("gameProcess").innerHTML = genCurrentGame();

    }
}

function getActiveRequests() {
    var usersArray;
    var x = sessionStorage.getItem("users");
    if(x === null){
        usersArray = [];
    } else {
        usersArray = x.split("|");
    }
    console.log(usersArray);
    var i = 0;
    firebase.database().ref('mafia/games/'+getActiveGameId()+'/users').once('value', function(snapshot) {
        var users = '';
        snapshot.forEach(function(childSnapshot) {
            var cur = childSnapshot.val().username;
            if(!usersArray.includes(cur)) {
                appendLine(cur, childSnapshot.val().role, childSnapshot.val().killed, i);
            } else {
                reDrawLine(cur, childSnapshot.val().role, childSnapshot.val().killed, i);
            }
            users = users+'|'+cur;
            i++;
        });
        users = users.substr(1);
        if(users !== "") {
            sessionStorage.setItem("users", users);
        }

    });
}

function buildString(name, role, killed) {
    var sBuilder = name;
    if(role !== "no") {
        sBuilder += " - " + role;
    }
    if(killed === "yes") {
        sBuilder += " - " + "KILLED";
    }
    return sBuilder;
}
/*
1 - doctor
2 - maniac
3 - woman
4 - mafia
 */
function getColorByInd(ind) {
    var res;
    switch (ind) {
        case 1:
            res = "blue";
            break;
        case 2:
            res = "brown";
            break;
        case 3:
            res = "pink";
            break;
        case 4:
            res = "red";
            break;
        default:
            res = "orange";
            break;
    }
    return res;
}

function getColor(name, ind) {
    return sessionStorage.getItem(name + "-" + ind + "color") || "grey";
}

function commonChange(name, ind) {
    var curColor = sessionStorage.getItem(name + "-" + ind + "color") || "grey";
    if(curColor === "grey") {
        sessionStorage.setItem(name + "-" + ind + "color", getColorByInd(ind));
    } else {
        sessionStorage.removeItem(name + "-" + ind + "color");
    }
}

function gameStarted() {
    return (sessionStorage.getItem("gameStarted") || "no") === "yes";

}

function drawButtons(name) {
    if(gameStarted()) {
        var sBuilder = "";
        sBuilder += "<button onclick=\"commonChange(\'" + name + "\',1);\" style=\"background-color:" + getColor(name, 1) + ";color:white\">DOC</button>";
        sBuilder += "<button onclick=\"commonChange(\'" + name + "\',2);\" style=\"background-color:" + getColor(name, 2) + ";color:white\">MAN</button>";
        sBuilder += "<button onclick=\"commonChange(\'" + name + "\',3);\" style=\"background-color:" + getColor(name, 3) + ";color:white\">WOM</button>";
        sBuilder += "<button onclick=\"commonChange(\'" + name + "\',4);\" style=\"background-color:" + getColor(name, 4) + ";color:white\">MAF</button>";
        return sBuilder;
    } else {
        return "";
    }
}

function drawKill(name) {
    if(gameStarted()) {
        var sBuilder = "";
        sBuilder += "<button onclick=\"kill(\'" + name + "\');\" style=\"background-color:red;color:white\">KILL</button>";
        return sBuilder;
    } else {
        return "";
    }
}

function kill(name) {
    firebase.database().ref('mafia/games/'+getActiveGameId()+"/users").child(name).update({
        killed: "yes"
    });
}

function appendLine(name, role, killed, ind) {
    console.log("append " + name);
    var table = document.getElementById("commonTable");
    var row = table.insertRow(ind);
    var cellName = row.insertCell(0);
    cellName.innerHTML = buildString(name, role, killed);
    cellName.id = name + "-cell";
    var cellButtons = row.insertCell(1);
    cellButtons.id = name + "-buttons";
    cellButtons.innerHTML = drawButtons(name);
    var cellKill = row.insertCell(2);
    cellKill.id = name + "-kill";
    cellKill.innerHTML = drawKill(name);
}

function reDrawLine(name, role, killed, ind) {
    console.log("redraw " + name);
    var x = document.getElementById(name + "-cell");
    if(x == null) {
        appendLine(name, role, killed, ind);
    } else {
        x.innerHTML = buildString(name, role, killed);
    }
    var y = document.getElementById(name + "-buttons");
    y.innerHTML = drawButtons(name);
    var z = document.getElementById(name + "-kill");
    z.innerHTML = drawKill(name);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function setRole(user, role) {
    firebase.database().ref('mafia/games/'+getActiveGameId()+'/users').child(user).update({
        role: role
    });
}

function assignRoles() {

    var users = shuffle(sessionStorage.getItem("users").split("|"));
    var usersCount = users.length;
    var mafiaCount = parseInt(document.getElementById("mafiaCount").value) || 0;
    var commissarCount = parseInt(document.getElementById("commissarCount").value) || 0;
    var doctorCount = parseInt(document.getElementById("doctorCount").value) || 0;
    var maniacCount = parseInt(document.getElementById("maniacCount").value) || 0;
    var womenCount = parseInt(document.getElementById("womanCount").value) || 0;
    var i = 0;
    for(i = 0; i < mafiaCount; i++){
        setRole(users[i], "MAFIA");
    }
    for(i = mafiaCount; i < mafiaCount + commissarCount; i++){
        setRole(users[i], "COMMISSAR");
    }
    for(i = mafiaCount + commissarCount; i < mafiaCount + commissarCount + doctorCount; i++){
        setRole(users[i], "DOCTOR");
    }
    for(i = mafiaCount + commissarCount + doctorCount; i < mafiaCount + commissarCount + doctorCount + maniacCount; i++){
        setRole(users[i], "MANIAC");
    }
    for(i = mafiaCount + commissarCount + doctorCount + maniacCount; i < mafiaCount + commissarCount + doctorCount + maniacCount + womenCount; i++){
        setRole(users[i], "WOMAN");
    }
    for(i = mafiaCount + commissarCount + doctorCount + maniacCount + womenCount; i < usersCount; i++){
        setRole(users[i], "CIVILIAN");
    }
    sessionStorage.setItem("gameStarted", "yes");
}

function clearAll() {
    sessionStorage.clear();
    location.reload();
}

function mainCycle() {
    setCurrentGameName();
    getActiveRequests();
    console.log('Background is running');
}