// constants for converting from tile location to canvas location
const MinX = 0;
const MaxX = 404;
const MinY = -24;
const MaxY = 391;
const MoveX = 101;
const MoveY = 83;

// generate random interger between min and max (inclusive)
function RandomInt(min, max) {
    return Math.floor((Math.random() * (max + 1 - min)) + min);
};

// generate random float between min (inclusive) and max (exclusive)
function Random(min, max) {
    return (Math.random() * (max + 1 - min)) + min;
};

// parent sprite class for all game objects
var Sprite = function (image, tileX, tileY) {
    // set image
    this.sprite = image;
    // calcuate canvas location based on tiles
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
        console.log("Last score: " + game.score);
        game.reset();
    }
}; // update

Enemy.prototype.reset = function () {
    // start off screen to the left
    this.x = MinX + -1.5 * MoveX;
    // random row
    this.y = MinY + RandomInt(1, 3) * MoveY;
    // random speed that gets faster as the game level gets higher
    this.speed = Random(1, 3) * (1 + game.level / 25);
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
    this.y = MinY + 5 * MoveY;
}; // reset

Player.prototype.changeCharacter = function () {
    // switch back and forth from boy to girl
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

// This class requires an update() and render() method.
var Gem = function (color, tileX, tileY) {
    // set image and value based on color
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

Gem.prototype.render = function () {
    ctx.save();
    // reduce size
    ctx.scale(0.5, 0.5);
    // correct location for reduced size
    ctx.translate(this.x + 52, this.y + 115);
    Sprite.prototype.render.call(this);
    ctx.restore();
}; // render

var Game = function () {
    this.reset();
}; // game

// reset game to base state, level 1, score 0
// 1 enemy on each row
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

// update to next level on player victory
Game.prototype.levelUp = function () {
    var colors = ["green", "blue", "orange"];
    // add level completion to score
    this.score += this.level;
    // change level
    this.level++;
    // add / move gem
    this.gem = new Gem(colors[RandomInt(0, 3)], RandomInt(0, 4), RandomInt(1, 3));
    // add new enemy every 5 levels
    if (this.level % 5 === 0) {
        allEnemies.push(new Enemy(RandomInt(1, 3), Random(1, 3)));
    }
}; // levelUp
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// allEnemies is set during the Game constructor
var allEnemies;
// create starting enemies, level 1, score 0
var game = new Game();
// new player in the middle of the bottom row
var player = new Player(2, 5);