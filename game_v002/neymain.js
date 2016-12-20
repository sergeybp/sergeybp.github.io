/**
 * Created by root on 31.01.16.
 */

var game = new Phaser.Game(600, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});
var player;
var badboy;
var bullets;
var bad2;
var ni = 0;
var va = 0;
var se = 0;
var je = 0;
var cursors;
var fireButton;
var stage = 0;
var score = 0;
var scoreText;
var bulletTime = 0;
var bullet;
var names = ['mary', 'niki', 'valery', 'serj', 'jenya'];
var chooseText;

var w = 600;
var h = 600;


function preload() {

    game.load.image('mary', 'assets/m1.png');
    game.load.image('bullet', 'assets/b1.png');
    game.load.image('niki', 'assets/n1.jpg');
    game.load.image('valery', 'assets/v1.jpg');
    game.load.image('serj', 'assets/s1.jpg');
    game.load.image('jenya', 'assets/j1.jpg');
    game.load.image('background', 'assets/back.jpg');
    game.load.image('modeshoot', 'assets/shoot.png');
    game.load.image('moderun', 'assets/run.png');
    game.load.image('start', 'assets/start.png');

}


function setGuys(meGuy) {
    var ind = 0;
    for (var i = 0; i < 5; i++) {
        if (meGuy == names[i]) {
            ind = i;
        }
    }

    player = game.add.sprite(w/2-30, 520, names[ind]);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    var k = 0;
    if (k == ind) {
        k++;
    }
    badboy = game.add.sprite(100, 100, names[k]);
    game.physics.arcade.enable(badboy);
    badboy.body.collideWorldBounds = true;
    k++;

    if (k == ind) {
        k++;
    }
    bad2 = game.add.sprite(200, 100, names[k]);
    game.physics.arcade.enable(bad2);
    bad2.body.collideWorldBounds = true;
    k++;

    if (k == ind) {
        k++;
    }
    bad3 = game.add.sprite(300, 100, names[k]);
    game.physics.arcade.enable(bad3);
    bad3.body.collideWorldBounds = true;
    k++;

    if (k == ind) {
        k++;
    }
    bad4 = game.add.sprite(400, 100, names[k]);
    game.physics.arcade.enable(bad4);
    bad4.body.collideWorldBounds = true;

}

//Here create menu
var GameName;
var ClickChoose;
var ChoosePers;
var CharChoosed;
var ModeChoose;
var mM, mV,mS,mN,mJ;
var modeS,modeR;
var start;
var choosedperson = 'mary';
var choosedmode = 'modeshoot';
var ModeChoosed;

function createMenu(){
    GameName = game.add.text(130, 10, 'Kill my friends v_0.0.2', {fontSize: '30px', fill: '#FF7'});
    ChoosePers = game.add.text(0, 50, '1) Choose you character', {fontSize: '24px', fill: '#d63c1a'});
    ClickChoose = game.add.text(0, 90, 'Click -> ', {fontSize: '22px', fill: '#FFF'});
    CharChoosed = game.add.text(0, 135, 'Character choosed: '+choosedperson, {fontSize: '24px', fill: '#e0005a'});
    var te = 70;
    var tr = 80;
    mM = game.add.sprite(te+50, tr, 'mary');
    mM.inputEnabled = true;
    mM.events.onInputDown.add(lM, this);

    mS = game.add.sprite(te+100, tr, 'serj');
    mS.inputEnabled = true;
    mS.events.onInputDown.add(lS, this);

    mN = game.add.sprite(te+150, tr, 'niki');
    mN.inputEnabled = true;
    mN.events.onInputDown.add(lN, this);

    mJ = game.add.sprite(te+200, tr, 'jenya');
    mJ.inputEnabled = true;
    mJ.events.onInputDown.add(lJ, this);

    mV = game.add.sprite(te+250, tr, 'valery');
    mV.inputEnabled = true;
    mV.events.onInputDown.add(lV, this);

    start = game.add.sprite(w/2-80, 370, 'start');
    start.inputEnabled = true;
    start.events.onInputDown.add(startGame, this);

    ModeChoose = game.add.text(0, 200, '2) Choose mode ', {fontSize: '24px', fill: '#d63c1a'});

    modeS = game.add.sprite(50, 230, 'modeshoot');
    modeS.inputEnabled = true;
    modeS.events.onInputDown.add(setShoot, this);

    modeR = game.add.sprite(150, 230, 'moderun');
    modeR.inputEnabled = true;
    modeR.events.onInputDown.add(setRun, this);

    ModeChoosed = game.add.text(0, 300, 'Mode choosed: '+choosedmode, {fontSize: '24px', fill: '#e0005a'});

}

function setShoot(){
    choosedmode = 'modeshoot';
    ModeChoosed.text = 'Mode choosed: '+choosedmode;
}

function setRun(){
    choosedmode = 'moderun';
    ModeChoosed.text = 'Mode choosed: '+choosedmode;
}

var fin,fi2;

function startGame(){
    GameName.text = '';
    ClickChoose.text = '';
    ChoosePers.text = '';
    CharChoosed.text ='';
    ModeChoose.text = '';
    ModeChoosed.text = '';
    mM.kill();
    mV.kill();
    mS.kill();
    mN.kill();
    mJ.kill();
    modeS.kill();
    modeR.kill();
    start.kill();
    if(choosedmode == 'modeshoot') {
        setGuys(choosedperson);
        nowMode = 1;
    }
    if(choosedmode == 'moderun'){
        scoreText = game.add.text(0, 0, 'Score: 0', {fontSize: '24px', fill: '#000'});
        setGuys(choosedperson);
        startTime();
        mode2fin = 0;
        nowMode = 3;
    }
}

function startTime(){
    timer = game.time.create(false);
    timer.loop(100, updateCounter, this);
    timer.start();
}

function lS(){
    choosedperson = 'serj';
    CharChoosed.text = 'Character choosed: '+choosedperson;
}
function lM(){
    choosedperson = 'mary';
    CharChoosed.text = 'Character choosed: '+choosedperson;
}
function lN(){
    choosedperson = 'niki';
    CharChoosed.text = 'Character choosed: '+choosedperson;
}
function lV(){
    choosedperson = 'valery';
    CharChoosed.text = 'Character choosed: '+choosedperson;
}
function lJ(){
    choosedperson = 'jenya';
    CharChoosed.text = 'Character choosed: '+choosedperson;
}

//menu created


var mode2fin = 0;
function create() {

    //set color
    game.stage.backgroundColor = 0x1FEBD6;

    //add bullet system
    bullets = game.add.physicsGroup();
    bullets.createMultiple(32, 'bullet', false);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    createMenu();

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    restartIt = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);

}


var nowMode = 0; // 0 -in menu
var chooser = 0;
var skipper = 0;
var killed = 0;
var secTotal = 0;


function update() {
    if (nowMode === 0) {

    }

    if (nowMode ==1){
        scoreText = game.add.text(5, 5, 'Killed:'+killed+'/4', {fontSize: '24px', fill: '#000'});
        nowMode = 2;
    }

    if(nowMode == 2) {

        game.physics.arcade.collide(badboy, player, killhim, null, this);
        game.physics.arcade.collide(bad2, player, killhim, null, this);
        game.physics.arcade.collide(bad3, player, killhim, null, this);
        game.physics.arcade.collide(bad4, player, killhim, null, this);
        game.physics.arcade.collide(bullet, badboy, killhimBad, null, this);
        game.physics.arcade.collide(bullet, bad2, killhimBad2, null, this);
        game.physics.arcade.collide(bullet, bad3, killhimBad3, null, this);
        game.physics.arcade.collide(bullet, bad4, killhimBad4, null, this);

        //player.body.velocity.x = 0;
        //var stage = 0;
        var min = 0;
        var max = 100;

        var c = Math.floor(Math.random() * (max - min + 1)) + min;

        if (stage % 10 === 0) {
            if (c >= 0 && c <= 25) {
                badboy.body.velocity.x = -600;
            }
            if (c > 25 && c <= 50) {
                badboy.body.velocity.x = 600;
            }
            if (c > 50 && c <= 75) {
                badboy.body.velocity.y = -600;
            }
            if (c > 75 && c < 100) {
                badboy.body.velocity.y = 600;
            }
        }


        var c1 = Math.floor(Math.random() * (max - min + 1)) + min;

        if (stage % 10 === 0) {
            if (c1 >= 0 && c1 <= 25) {
                bad2.body.velocity.x = -600;
            }
            if (c1 > 25 && c1 <= 50) {
                bad2.body.velocity.x = 600;
            }
            if (c1 > 50 && c1 <= 75) {
                bad2.body.velocity.y = -600;
            }
            if (c1 > 75 && c1 < 100) {
                bad2.body.velocity.y = 600;
            }
        }

        var c2 = Math.floor(Math.random() * (max - min + 1)) + min;

        if (stage % 10 === 0) {
            if (c2 >= 0 && c2 <= 25) {
                bad3.body.velocity.x = -600;
            }
            if (c2 > 25 && c2 <= 50) {
                bad3.body.velocity.x = 600;
            }
            if (c2 > 50 && c2 <= 75) {
                bad3.body.velocity.y = -600;
            }
            if (c2 > 75 && c2 < 100) {
                bad3.body.velocity.y = 600;
            }
        }

        var c3 = Math.floor(Math.random() * (max - min + 1)) + min;

        if (stage % 10 === 0) {
            if (c3 >= 0 && c3 <= 25) {
                bad4.body.velocity.x = -600;
            }
            if (c3 > 25 && c3 <= 50) {
                bad4.body.velocity.x = 600;
            }
            if (c3 > 50 && c3 <= 75) {
                bad4.body.velocity.y = -600;
            }
            if (c3 > 75 && c3 < 100) {
                bad4.body.velocity.y = 600;
            }
        }

        stage++;


        if (restartIt.isDown) {
            ni = 0;
            je = 0;
            va = 0;
            se = 0;
            nowMode = 0;
            game.state.start(game.state.current);
        }
        if (cursors.left.isDown) {
            player.body.velocity.x = -600;
        }
        if (cursors.right.isDown) {
            player.body.velocity.x = 600;
        }
        if (cursors.up.isDown) {
            player.body.velocity.y = -600;
        }
        if (cursors.down.isDown) {
            player.body.velocity.y = 600;
        }

        if (fireButton.isDown) {
            fireBullet();
        }
    }

    if (nowMode == 3){
        game.physics.arcade.collide(badboy, player, killmode2, null, this);
        game.physics.arcade.collide(bad2, player, killmode2, null, this);
        game.physics.arcade.collide(bad3, player, killmode2, null, this);
        game.physics.arcade.collide(bad4, player, killmode2, null, this);

        var min = 0;
        var max = 100;

        var c = Math.floor(Math.random() * (max - min + 1)) + min;

        if (stage % 10 === 0) {
            if (c >= 0 && c <= 25) {
                badboy.body.velocity.x = -600;
            }
            if (c > 25 && c <= 50) {
                badboy.body.velocity.x = 600;
            }
            if (c > 50 && c <= 75) {
                badboy.body.velocity.y = -600;
            }
            if (c > 75 && c < 100) {
                badboy.body.velocity.y = 600;
            }
        }


        var c1 = Math.floor(Math.random() * (max - min + 1)) + min;

        if (stage % 10 === 0) {
            if (c1 >= 0 && c1 <= 25) {
                bad2.body.velocity.x = -600;
            }
            if (c1 > 25 && c1 <= 50) {
                bad2.body.velocity.x = 600;
            }
            if (c1 > 50 && c1 <= 75) {
                bad2.body.velocity.y = -600;
            }
            if (c1 > 75 && c1 < 100) {
                bad2.body.velocity.y = 600;
            }
        }

        var c2 = Math.floor(Math.random() * (max - min + 1)) + min;

        if (stage % 10 === 0) {
            if (c2 >= 0 && c2 <= 25) {
                bad3.body.velocity.x = -600;
            }
            if (c2 > 25 && c2 <= 50) {
                bad3.body.velocity.x = 600;
            }
            if (c2 > 50 && c2 <= 75) {
                bad3.body.velocity.y = -600;
            }
            if (c2 > 75 && c2 < 100) {
                bad3.body.velocity.y = 600;
            }
        }

        var c3 = Math.floor(Math.random() * (max - min + 1)) + min;

        if (stage % 10 === 0) {
            if (c3 >= 0 && c3 <= 25) {
                bad4.body.velocity.x = -600;
            }
            if (c3 > 25 && c3 <= 50) {
                bad4.body.velocity.x = 600;
            }
            if (c3 > 50 && c3 <= 75) {
                bad4.body.velocity.y = -600;
            }
            if (c3 > 75 && c3 < 100) {
                bad4.body.velocity.y = 600;
            }
        }

        stage++;


        if (restartIt.isDown) {
            ni = 0;
            je = 0;
            va = 0;
            se = 0;
            nowMode = 0;
            secTotal = 0;
            
            game.state.start(game.state.current);
        }

        if (fireButton.isDown && mode2fin == 1) {

            mode2fin = 0;
            fi2.text = '';
            fin.text = '';
            secTotal = 0;
            setGuys(choosedperson);
            startTime();

        }

        if (cursors.left.isDown) {
            player.body.velocity.x = -600;
        }
        if (cursors.right.isDown) {
            player.body.velocity.x = 600;
        }
        if (cursors.up.isDown) {
            player.body.velocity.y = -600;
        }
        if (cursors.down.isDown) {
            player.body.velocity.y = 600;
        }

    }


}

function updateCounter() {
    secTotal++;
    scoreText.text = 'Score: '+secTotal;

}

function fireBullet() {

    if (game.time.time > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(player.x + 6, player.y - 12);
            bullet.body.velocity.y = -600;
            bulletTime = game.time.time + 100;
        }
    }

}

function killhim() {
    //scoreText.text = 'LOH!!!';
    score = 0;
    ni = 0;
    je = 0;
    va = 0;
    se = 0;
    killemup();

}



function killmode2(){
    bad2.kill();
    badboy.kill();
    bad3.kill();
    bad4.kill();
    player.kill();
    timer.destroy();
    scoreText.text = '';
    mode2fin =1;
    fin =  game.add.text(200, h/2-50, 'You score: '+secTotal+' !', {fontSize: '24px', fill: '#000'});
    fi2 =  game.add.text(50, h/2, 'Space to restart! Backspace to go to menu!', {fontSize: '24px', fill: '#000'});
}

function killemup(){
    bad2.kill();
    badboy.kill();
    bad3.kill();
    bad4.kill();
    player.kill();
    killed = 0;
    setKilled();
    setGuys(choosedperson);
}

function setKilled(){
    scoreText.text = 'Killed:'+killed+'/4';
}


function killhimBad() {
    badboy.kill();
    bullet.kill();
    killed++;
    setKilled();
    se = 1;
    check();

}

function killhimBad2() {
    bad2.kill();
    bullet.kill();
    killed++;
    setKilled();
    ni = 1;
    check();
}

function killhimBad3() {
    bad3.kill();
    bullet.kill();
    killed++;
    setKilled();
    va = 1;
    check();
}

function killhimBad4() {
    bad4.kill();
    bullet.kill();
    killed++;
    setKilled();
    je = 1;
    check();
}

function check() {
    if (se == 1 && ni == 1 && va == 1 && je == 1) {
        badboy.kill();
        bad2.kill();
        bad3.kill();
        bad4.kill();
        killed = 0;

        scoreText.text = 'You win! BACKSPACE - to go to main menu';
    }
}


