/**
 * Created by sergeybp on 30.05.16.
 */
var color = "#00ff00";
var color1 = "#ff0000";
var color2 = "#ffff00";
var color3 = "#3366ff";
var a = [];

function cl(id){
    if(a[id] != 1) {
        if(document.getElementById(id).textContent == "+")
            document.getElementById(id).style.background = color;
        if(document.getElementById(id).textContent == "-")
            document.getElementById(id).style.background = color1;
        if(document.getElementById(id).textContent == "^")
            document.getElementById(id).style.background = color2;
        if(document.getElementById(id).textContent == "@")
            document.getElementById(id).style.background = color3;

        a[id] = 1;
    } else {
        document.getElementById(id).style.background = "#FFFFFF";
        a[id] = 0;
    }
}