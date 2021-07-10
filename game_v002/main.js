/**
 * Created by root on 31.01.16.
 */

var game = new Phaser.Game(480, 640, Phaser.AUTO, '', {preload: preload, create: create, update: update});
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
var names = ['mary', 'niki', 'valery', 'serj', 'jenya', 'ilya'];
var chooseText;


function preload() {

    game.load.image('mary', 'assets/m1.png');
    game.load.image('bullet', 'assets/b1.png');
    game.load.image('niki', 'assets/n1.jpg');
    game.load.image('valery', 'assets/v1.jpg');
    game.load.image('serj', 'assets/s1.jpg');
    game.load.image('jenya', 'assets/j1.jpg');
	game.load.image('ilya', 'assets/i1.jpg');
    game.load.image('background', 'assets/back.jpg');

}


function setGuys(meGuy) {
    var ind = 0;
    for (var i = 0; i < 5; i++) {
        if (meGuy == names[i]) {
            ind = i;
        }
    }

    player = game.add.sprite(400, 550, names[ind]);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    var k = 0;
    if (k == ind) {
        k++;
    }
    badboy = game.add.sprite(300, 300, names[k]);
    game.physics.arcade.enable(badboy);
    badboy.body.collideWorldBounds = true;
    k++;

    if (k == ind) {
        k++;
    }
    bad2 = game.add.sprite(500, 300, names[k]);
    game.physics.arcade.enable(bad2);
    bad2.body.collideWorldBounds = true;
    k++;

    if (k == ind) {
        k++;
    }
    bad3 = game.add.sprite(100, 300, names[k]);
    game.physics.arcade.enable(bad3);
    bad3.body.collideWorldBounds = true;
    k++;

    if (k == ind) {
        k++;
    }
    bad4 = game.add.sprite(100, 100, names[k]);
    game.physics.arcade.enable(bad4);
    bad4.body.collideWorldBounds = true;

}


function create() {

    game.stage.backgroundColor = 0x1FEBD6;

    scoreText = game.add.text(0, 16, 'Use arrows to change, space - choose', {fontSize: '20px', fill: '#FFF'});
    chooseText = game.add.text(0, 40, 'Play as: ' + names[0], {fontSize: '22px', fill: '#FFF'});

    bullets = game.add.physicsGroup();

    bullets.createMultiple(32, 'bullet', false);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);




    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    restartIt = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);

}


var nowMode = 0;
var chooser = 0;
var skipper = 0;

function update() {
    skipper++;
    if (nowMode === 0) {
        if(skipper%10 === 0) {
            if (cursors.down.isDown) {
                chooser++;
                if (chooser > 5) {
                    chooser = 5;
                }
                chooseText.text = 'Play as: ' + names[chooser];
            }
            if (cursors.up.isDown) {
                chooser--;
                if (chooser < 0) {
                    chooser = 0;
                }
                chooseText.text = 'Play as: ' + names[chooser];
            }

            if (fireButton.isDown) {
                setGuys(names[chooser]);
                nowMode = 1;
                chooseText.text = '';
                scoreText.text = 'Kill my friends!';

            }
        }

    } else {


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
    scoreText.text = 'LOH!!!';
    score = 0;
    ni = 0;
    je = 0;
    va = 0;
    se = 0;
	il = 0;
    killemup();

}

function killemup(){
    bad2.kill();
    badboy.kill();
    bad3.kill();
    bad4.kill();
    player.kill();
    setGuys(names[chooser]);
}

function killhim2() {
    scoreText.text = 'LOH!!!';
    score = 0;
    game.state.start(game.state.current);
}

function killhimBad() {
    badboy.kill();
    bullet.kill();
    se = 1;
    check();

}

function killhimBad2() {
    bad2.kill();
    bullet.kill();
    ni = 1;
    check();
}

function killhimBad3() {
    bad3.kill();
    bullet.kill();
    va = 1;
    check();
}

function killhimBad4() {
    bad4.kill();
    bullet.kill();
    je = 1;
    check();
}

function check() {
    if (se == 1 && ni == 1 && va == 1 && je == 1) {
        badboy.kill();
        bad2.kill();
        bad3.kill();
        bad4.kill();

        scoreText.text = 'GREAT! backspace to restart';
    }
}


