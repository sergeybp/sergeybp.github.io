

var current=""
var store=0

function calc(n)
{
current=current+n
write(current)
}

function add()
{
store=Number(current)+store
current=""
write(current)
}

function equals()
{
store=store+Number(current)
write(store)
}


function write(word){
 document.getElementById("lol").textContent = word
}
