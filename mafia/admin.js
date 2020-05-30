var config = {};
setInterval(function(){mainCycle(); }, 3000);
window.onload = function exampleFunction() {
    mainCycle();
};

function createNewGame() {
    var gameId = document.getElementById('gameId').value;
    var configString = atob(document.getElementById('apiKey').value);
    var preConf = configString.split('&');
    config = {
        apiKey: preConf[0],
        authDomain: preConf[1],
        databaseURL: preConf[2],
        projectId: preConf[3],
        storageBucket: preConf[4],
        messagingSenderId: preConf[5]
    };
    firebase.initializeApp(config);
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
    var roles = getCurrentRoles();
    sessionStorage.setItem("currentRound", currentRound + 1);
    var users = sessionStorage.getItem("users").split("|");
    for(var i = 0; i < users.length; i++) {
        for(k = 0; k < roles.length; k++) {
            sessionStorage.removeItem(users[i] + "-" + k + "color");
        }
    }

}

function genCurrentGame() {

    var currentRound = sessionStorage.getItem("currentRound") || "Press Falling asleep to start round.";
    if(gameStarted()) {
        var sBuilder = "Current round: " + currentRound + "<br>";
        sBuilder += "<button onclick=\"commonClear();\" style=\"background-color:darkgreen;color:white\">Falling asleep</button><br>";
        var roles = getCurrentRoles();
        sBuilder += "Don't forget: <br>";
        roles.forEach(p => {
            sBuilder += p.name +" wakes up <br>";
        });
        return sBuilder;
    } else {
        return "";
    }
}

function setCurrentGameName() {
    document.getElementById("currentGameLabel").textContent = 'http://sergeybp.github.io/mafia/participant.html?game='+getActiveGameId()+'&magic='+document.getElementById('apiKey').value;
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
        case 5:
            res = "green";
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

class Role {
    constructor(name, count) {
        this.name = name;
        this.count = count;
    }
}

function getCurrentRoles() {
    var currentRoles = (sessionStorage.getItem("roles") || "").substring(1).split("|");
    var roles = [];
    for(i = 0; i < currentRoles.length; i++) {
        var tmp = currentRoles[i].split("&");
        roles.push(new Role(tmp[0], tmp[1]));
    }
    return roles;
}

function getRolesString() {
    var roles = getCurrentRoles();
    var s = "";
    roles.forEach(p => {
        s += p.name + "("+p.count+"); "
    });
    console.log(s);
    return s;
}

function addRole() {
    var currentRoles = (sessionStorage.getItem("roles") || "");
    currentRoles += "|" + document.getElementById("roleName").value + "&" + document.getElementById("roleCount").value;
    sessionStorage.setItem("roles", currentRoles);
    document.getElementById("roleName").value = "";
    document.getElementById("roleCount").value = "";
    document.getElementById("roles").textContent = getRolesString();
}

function drawButtons(name) {
    if(gameStarted()) {
        var sBuilder = "";
        var roles = getCurrentRoles();
        var k = 0;
        roles.forEach(p => {
            sBuilder += "<button onclick=\"commonChange(\'" + name + "\',"+k+");\" style=\"background-color:" + getColor(name, k) + ";color:white\">"+p.name.substring(0,3)+"</button>";
            k++;
        });
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

    var defaultRole = document.getElementById("defaultRole").value;

    var users = shuffle(sessionStorage.getItem("users").split("|"));
    var usersCount = users.length;
    var roles = getCurrentRoles();
    var i = 0;
    roles.forEach(role => {
       for(k = 0; k < parseInt(role.count) || 0; k++){
           setRole(users[i], role.name);
           i++;
       }
    });
    for(k = i; k < usersCount; k++) {
        setRole(users[k], defaultRole);
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