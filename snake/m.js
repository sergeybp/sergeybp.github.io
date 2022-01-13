c = document.getElementById("canvas");
ctx = c.getContext("2d");
const MAX_D = 20
w = 400
h = 400

sw = w/MAX_D
sh = h/MAX_D

function drawSq(i, j, e) {
    let x = i * sw
    let y = j * sh
    ctx.fillStyle = e ? "#712ffc" : "#486eee";
    let ww = sw/10
    let hh = sh/10
    ctx.fillRect(x+ww, y+hh, sw-ww, sh-hh)
}

function drawFood(i, j) {
    let x = i * sw
    let y = j * sh
    ctx.fillStyle = "#1fdb46";
    let ww = sw/10
    let hh = sh/10
    ctx.fillRect(x+ww, y+hh, sw-ww, sh-hh)
}

function drawPath(i, j) {
    let x = i * sw
    let y = j * sh
    ctx.fillStyle = "#ff2d8a";
    let ww = sw/10
    let hh = sh/10
    ctx.fillRect(x+sw/2-ww, y+sh/2-hh, ww*2, hh*2)
}

function init() {
    ctx.strokeStyle = "#000000"
    ctx.clearRect(0, 0, w, h)
    ctx.strokeRect(0, 0, w, h);
}
// 0-right 1-down 2-left 3-up
headX = MAX_D / 2
headY = MAX_D / 2
tailX = headX - 2
tailY = headY
headDir = 0
tailDir = 0
var board = Array(MAX_D).fill(null).map(() => Array(MAX_D).fill(0));
var boardCopy = Array(MAX_D).fill(null).map(() => Array(MAX_D).fill(0));
var turnsQueue = []

board[headX][headY] = 1
board[headX-1][headY] = 1
board[headX-2][headY] = 1

curPathToFood = []
curPathToGo = []

function curPathToFoodContains(sx, sy) {
    let res = false
    for(let i = 0;i< curPathToFood.length-1;i++){
        if(curPathToFood[i][0] === sx && curPathToFood[i][1] === sy) res = true
    }
    return res
}

function foodExists() {
    let res = []
    for(let i =0;i<board.length;i++)
        for(let j =0;j<board.length;j++)
            if (board[i][j] === 2) res = [i, j]
    return res
}

function destroyGame() {
    window.location.reload()
}

lastFoodX = 0
lastFoodY = 0
function moveHead() {
    let food = foodExists()
    let skipRecalc = food.length > 0 &&
        food[0] === lastFoodX &&
        food[1] === lastFoodY &&
        curPathToFood.length > 0

    if(food.length === 0) {
        curPathToFood = []
        if(curPathToGo.length === 0 ) {
            boardCopy = Array(MAX_D).fill(null).map(() => Array(MAX_D).fill(0))
            let ux = getRandomInt(MAX_D)
            let uy = getRandomInt(MAX_D)
            let tt = findEmpty(ux, uy)
            let t = findWay(headX, headY, tt[0], tt[1])
            curPathToGo = t
            curPathToGo.reverse()
            curPathToGo.shift()
        }
    } else if(!skipRecalc && (curPathToFood.length === 0 || !(lastFoodX === food[0] && lastFoodY === food[1]))) {
        curPathToGo = []
        boardCopy = Array(MAX_D).fill(null).map(() => Array(MAX_D).fill(0))
        lastFoodX = food[0]
        lastFoodY = food[1]
        let t = findWay(headX, headY, 0, 0)
        curPathToFood = t
        curPathToFood.reverse()
        curPathToFood.shift()
        if(curPathToFood.length === 0) destroyGame()
    }

    if(
        skipRecalc
    ) {
        let move = curPathToFood[0]
        curPathToFood.shift()
        if(move[0] > headX) changeDir(0)
        else if(move[0] < headX) changeDir(2)
        else if(move[1] > headY) changeDir(1)
        else if(move[1] < headY) changeDir(3)

    } else if(curPathToGo.length > 0) {
        let move = curPathToGo[0]
        curPathToGo.shift()
        if(move[0] > headX) changeDir(0)
        else if(move[0] < headX) changeDir(2)
        else if(move[1] > headY) changeDir(1)
        else if(move[1] < headY) changeDir(3)
    }


    if(headDir === 0) {
        headX += 1
    } else if(headDir === 2) {
        headX -= 1
    } else if(headDir === 1) {
        headY += 1
    } else if(headDir === 3) {
        headY -= 1
    }
    if(
        headX < 0 ||
        headX >= board.length ||
        headY < 0 ||
        headY >= board.length ||
        board[headX][headY] === 1
    ) destroyGame()


    if(board[headX][headY] === 2) {
        board[headX][headY] = 3
    } else {
        board[headX][headY] = 1
    }
}

function moveTail() {
    if(board[tailX][tailY] === 3) board[tailX][tailY] = 1
    else {
        if (turnsQueue.length > 0 && turnsQueue[0][0] === tailX && turnsQueue[0][1] === tailY) {
            tailDir = turnsQueue[0][2]
            turnsQueue.shift()
        }
        board[tailX][tailY] = 0
        if (tailDir === 0) {
            tailX += 1
        } else if (tailDir === 2) {
            tailX -= 1
        } else if (tailDir === 1) {
            tailY += 1
        } else if (tailDir === 3) {
            tailY -= 1
        }
    }

}

function go() {
    init()

    moveHead()
    moveTail()

    for(let x = 0; x < MAX_D; x++) {
        for(let y = 0; y < MAX_D; y++) {
            if(board[x][y] === 1) drawSq(x, y, false)
            if(board[x][y] === 3) drawSq(x, y, true)
            if(board[x][y] === 2) drawFood(x, y)
            if(curPathToFoodContains(x, y)) drawPath(x, y)
        }
    }
}

function colorise(sx, sy, d) {
    if (
        sx < 0 ||
        sx >= board.length ||
        sy < 0 ||
        sy >= board.length ||
        board[sx][sy] === 1 ||
        board[sx][sy] === 3 ||
        (boardCopy[sx][sy] !== 0 && boardCopy[sx][sy] <= d)
    ) return 0
    else {
        boardCopy[sx][sy] = d
        colorise(sx+1, sy, d+1)
        colorise(sx-1, sy, d+1)
        colorise(sx, sy+1, d+1)
        colorise(sx, sy-1, d+1)
        return 0
    }
}

function findWay(ssx, ssy, psx, psy) {
    colorise(ssx, ssy, 1)
    let realx = psx === 0?lastFoodX:psx
    let realy = psy === 0?lastFoodY:psy
    if(boardCopy[realx][realy] === 0) return []
    else {
        let sx = realx
        let sy = realy
        let res = [[sx, sy]]
        while (!(sx === ssx && sy === ssy)) {
            let v = boardCopy[sx][sy]
            if(sx - 1 >= 0 && boardCopy[sx-1][sy] === v - 1) {
                sx = sx - 1
                res.push([sx, sy])
            } else if(sy - 1 >= 0 && boardCopy[sx][sy-1] === v - 1) {
                sy = sy - 1
                res.push([sx, sy])
            } else if(sx + 1 < board.length && boardCopy[sx+1][sy] === v - 1) {
                sx = sx + 1
                res.push([sx, sy])
            } else if(sy + 1 < board.length && boardCopy[sx][sy+1] === v - 1) {
                sy = sy + 1
                res.push([sx, sy])
            }
        }
        return res
    }

}

const interval = setInterval(function() {
    go()
}, 50);


const foodCreation = setInterval(function() {
    createFood()
}, 2000);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


/*document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            changeDir(2)
            break;
        case 38:
            changeDir(3)
            break;
        case 39:
            changeDir(0)
            break;
        case 40:
            changeDir(1)
            break;
    }
};*/

function findEmpty(sx, sy) {
    if(
        sx < 0 ||
        sx >= board.length ||
        sy < 0 ||
        sy >= board.length
    ) return null
    else if(
        board[sx][sy] !== 1
    ) return [sx, sy]
    else {
        let t = findEmpty(sx-1,sy)
        if(t !== null) return t
        else {
            t = findEmpty(sx+1,sy)
            if(t !== null) return t
            else {
                t = findEmpty(sx, sy-1)
                if(t !== null) return t
                else {
                    return findEmpty(sx, sy+1)
                }
            }
        }
    }
}

function createFood() {
    let tx = getRandomInt(MAX_D-2)+1
    let ty = getRandomInt(MAX_D-2)+1
    let r = findEmpty(tx, ty)
    if(r === null) destroyGame()
    else {
        for(let i =0;i<board.length;i++)
            for(let j =0;j<board.length;j++)
                if(board[i][j] === 2) board[i][j] = 0
        board[r[0]][r[1]] = 2
    }
}

function changeDir(dir) {
    // 0-right 1-down 2-left 3-up
    if(
        !(dir === 0 && headDir === 2) &&
        !(dir === 2 && headDir === 0) &&
        !(dir === 1 && headDir === 3) &&
        !(dir === 3 && headDir === 1)
    ) {
        headDir = dir
        turnsQueue.push([headX, headY, headDir])
    }
}
