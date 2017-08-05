const MinX = 0;
const MaxX = 404;
const MinY = -24;
const MaxY = 391;
const MoveX = 101;
const MoveY = 83;

function RandomInt(min, max) {
    return Math.floor((Math.random() * (max + 1 - min)) + min);
};

function Random(min, max) {
    return (Math.random() * (max + 1 - min)) + min;
};

// parent sprite class for all game objects
var Sprite = function (image, tileX, tileY) {
    this.sprite = image;
    this.x = MinX + tileX * MoveX;
    this.y = MinY + tileY * MoveY;
} // sprite

Sprite.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}; // render

// Enemies our player must avoid
var Enemy = function (tileY, speed) {
    Sprite.call(this, "images/enemy-bug.png", -1.5, tileY);
    this.speed = speed;
}; // enemy

Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed * 50 * dt);
    if (this.x > MaxX + 1.5 * MoveX) {
        this.reset();
    }
    // detect collision with player
    if (player.y === this.y && Math.abs(player.x - this.x) < 75) {
        player.reset();
        game.reset();
    }
}; // update

Enemy.prototype.reset = function () {
    this.x = MinX + -1.5 * MoveX;
    this.y = MinY + RandomInt(1, 3) * MoveY;
    this.speed = Random(1, 3);
}; // reset
// This class requires an update(), render() and a handleInput() method.
var Player = function (tileX, tileY) {
    Sprite.call(this, "images/char-boy.png", tileX, tileY);
}; // player

Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function (dt) { }; // update

Player.prototype.handleInput = function (key) {
    switch (key) {
        case "left":
            this.x = Math.max(MinX, this.x - MoveX);
            break;
        case "up":
            this.y = Math.max(MinY, this.y - MoveY);
            break;
        case "right":
            this.x = Math.min(MaxX, this.x + MoveX);
            break;
        case "down":
            this.y = Math.min(MaxY, this.y + MoveY);
            break;
        case "space":
            this.changeCharacter();
            break;
    } // switch
    if (this.y <= 0) {
        // victory condition
        game.levelUp();
        this.reset();
    }
}; // handleInput

Player.prototype.reset = function () {
    this.y = MinY + 4 * MoveY;
}; // reset

Player.prototype.changeCharacter = function () {
    if (this.sprite == "images/char-boy.png") {
        this.sprite = "images/char-pink-girl.png";
    } else {
        this.sprite = "images/char-boy.png";
    }
} // change character

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function (e) {
    var allowedKeys = {
        32: "space",
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    player.handleInput(allowedKeys[e.keyCode]);
}); // keyup event listener

// This class requires an update(), render() and a handleInput() method.
var Gem = function (color, tileX, tileY) {
    switch (color) {
        case "blue":
            Sprite.call(this, "images/Gem Blue.png", tileX, tileY);
            this.value = 5;
            break;
        case "orange":
            Sprite.call(this, "images/Gem Orange.png", tileX, tileY);
            this.value = 10;
            break;
        default:
            Sprite.call(this, "images/Gem Green.png", tileX, tileY);
            this.value = 1;
            break;
    }
}; // gem

Gem.prototype = Object.create(Sprite.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.update = function (dt) {
    // detect collision with player
    if (player.y === this.y && Math.abs(player.x - this.x) < 75) {
        game.score += this.value;
        game.gem = undefined;
    }
}; // update

var Game = function () {
    this.reset();
}; // game

Game.prototype.reset = function () {
    this.level = 1;
    this.score = 0;
    allEnemies = [
        new Enemy(1, Random(1, 3)),
        new Enemy(2, Random(1, 3)),
        new Enemy(3, Random(1, 3))
    ];
    this.gem = undefined;
}; // reset

Game.prototype.levelUp = function () {
    var colors = ["green", "blue", "orange"];
    this.score += this.level;
    this.level++;
    this.gem = new Gem(colors[RandomInt(0, 3)], RandomInt(0, 4), RandomInt(1, 3));
    if (this.level % 5 === 0) {
        allEnemies.push(new Enemy(RandomInt(1, 3), Random(1, 3)));
    }
}; // levelUp
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// allEnemies is set during the Game constructor
var allEnemies;
var game = new Game();
var player = new Player(2, 5);