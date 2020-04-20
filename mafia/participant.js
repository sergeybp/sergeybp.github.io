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

function joinGame(gameId) {
    //var gameId = document.getElementById('gameId').value;
    var gameName = '';
    firebase.database().ref('mafia/games/'+gameId).once('value').then(function(snapshot) {
        gameName = (snapshot.val() && snapshot.val().gameName) || 'NOT_FOUND';
        if(gameName === "NOT_FOUND") {
            //alert("Game not found!")
        } else {
            sessionStorage.setItem("currentGameId", gameId);
            sessionStorage.setItem("currentGameName", gameName);
            setCurrentGameName();
        }
    });

}

function getActiveGameId() {
    //return getUrlParam("game", "none");
    return sessionStorage.getItem("currentGameId");
}

function gameExists() {
    return getActiveGameId() === getUrlParam("game", "none");
}

function setCurrentGameName() {

    if(sessionStorage.getItem("roleRequested") === "yes") {
        document.getElementById("joinGameDiv").innerHTML = "Ваше имя в игре: " + sessionStorage.getItem("username").substring(4);
    }

    document.getElementById("currentGameLabel").textContent = "Текущая игра: " +  sessionStorage.getItem("currentGameName");
    var currentRound = sessionStorage.getItem("currentRound") || "no";
    if(currentRound !== "no") {
        document.getElementById("currentRound").textContent = "Текущий раунд: "+currentRound;
    }
}

function setCurrentGameStatus() {
    if(sessionStorage.getItem("roleRequested") === "yes" && sessionStorage.getItem("roleAssigned") === "no") {
        document.getElementById("gameStarting").textContent = "Игра скоро начнется... Пожалуйста, подождите";
        document.getElementById("currentRole").textContent = "";
    }

    if(sessionStorage.getItem("roleRequested") === "yes" && sessionStorage.getItem("roleAssigned") !== "no") {
        document.getElementById("gameStarting").textContent = "Игра началась!";
        document.getElementById("currentRole").textContent = sessionStorage.getItem("roleAssigned");
    }

    if(sessionStorage.getItem("killed") === "yes") {
        document.getElementById("killed").textContent = "ВЫ БЫЛИ УБИТЫ :(";
    } else {
        document.getElementById("killed").textContent = "";
    }


}

function clearAll() {
    sessionStorage.clear();
    location.reload();
}

function refreshMyInfo() {
    var username = sessionStorage.getItem("username");
    var gameId = getActiveGameId();
    if(username === '' || gameId === '') {
    } else {
        firebase.database().ref('mafia/games/'+gameId+'/users/'+username).once('value').then(function(snapshot) {
            var role = (snapshot.val() && snapshot.val().role) || 'no';
            var killed = (snapshot.val() && snapshot.val().killed) || 'no';
            sessionStorage.setItem("roleAssigned", role);
            sessionStorage.setItem("killed", killed);
            setCurrentGameStatus();
        });
    }
}

function makeid(length) {
    var result           = '';
    var characters       = '0123456789abcgdhjatyuiop';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function requestRole() {
    var username = makeid(3) + "_" + document.getElementById("username").value;
    var gameId = getActiveGameId();
    if(username === '' || gameId === '') {
        alert("Please join game and enter name first!")
    } else {
        firebase.database().ref('mafia/games/' + getActiveGameId() + '/users').child(username).set({
            username: username,
            role: "no",
            killed: "no"
        });
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("roleRequested", "yes");
        sessionStorage.setItem("roleAssigned", "no");
        setCurrentGameStatus();
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

    firebase.database().ref('mafia/games/'+getActiveGameId()).once('value', function(snapshot) {
        var round = snapshot.val().currentRound || "no";
        sessionStorage.setItem("currentRound", round);
    });

    var i = 0;
    firebase.database().ref('mafia/games/'+getActiveGameId()+'/users').once('value', function(snapshot) {
        var users = '';
        snapshot.forEach(function(childSnapshot) {
            var cur = childSnapshot.val().username.substring(4);
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
    var meKilled = sessionStorage.getItem("killed") === "yes";
    var sBuilder = name;
    if(role !== "no" && meKilled) {
        sBuilder += " - " + role;
    }
    if(killed === "yes") {
        sBuilder += " - " + "УБИТ";
    }
    return sBuilder;
}

function appendLine(name, role, killed, ind) {
    var table = document.getElementById("commonTable");
    var row = table.insertRow(ind);
    var cellName = row.insertCell(0);
    cellName.innerHTML = buildString(name, role, killed);
    cellName.id = name + "-cell";
}

function reDrawLine(name, role, killed, ind) {
    var x = document.getElementById(name + "-cell");
    if(x == null) {
        appendLine(name, role, killed, ind);
    } else {
        x.innerHTML = buildString(name, role, killed);
    }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}




function mainCycle() {

    if(gameExists()) {
        setCurrentGameName();
        refreshMyInfo();
        setCurrentGameStatus();
        getActiveRequests();
    } else {
        if(getActiveGameId !== null) {
            sessionStorage.clear();
        }
        document.getElementById("joinGameDiv").isContentEditable = false;
        var gameFromUrl = getUrlParam("game", "none");
        if(gameFromUrl !== "none") {
            joinGame(gameFromUrl);
        }
    }
}