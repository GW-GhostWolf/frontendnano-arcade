const MinX = 0;
const MaxX = 404;
const MinY = -24;
const MaxY = 396;
const MoveX = 101;
const MoveY = 84;

function Random(min, max) {
    return Math.floor((Math.random() * (max + 1 - min)) + min);
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
    if (this.x > MaxX + 1.5 * MoveX) { this.x = MinX + -1.5 * MoveX; }
    // detect collision with player
    if (player.y === this.y && Math.abs(player.x - this.x) < 75) {
        player.Reset();
    }
    //console.log(this.x);
}; // update

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
    } // switch
    if (this.y <= 0) {
        // victory condition
        this.Reset();
    }
    console.log(this.x, this.y);
}; // handleInput

Player.prototype.Reset = function () {
    this.y = MinY + 4 * MoveY;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function (e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    player.handleInput(allowedKeys[e.keyCode]);
}); // keyup event listener

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(Random(0, 4), Random(4, 5));
var allEnemies = [new Enemy(Random(1, 3), Random(1, 5)), new Enemy(Random(1, 3), Random(1, 5)), new Enemy(Random(1, 3), Random(1, 5))];