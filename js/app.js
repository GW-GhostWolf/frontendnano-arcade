// Enemies our player must avoid
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = "images/enemy-bug.png";
    this.x = -10;
    this.y = 51;
    this.speed = 50;
}; // enemy

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed * dt);
    if (this.x > 525) { this.x = -126; }
    //console.log(this.x);
}; // update

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}; // render

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    this.sprite = "images/char-boy.png";
    this.x = 202;
    this.y = 303;
}; // player

Player.prototype.update = function () {

}; // update

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}; // render

Player.prototype.handleInput = function (key) {
    switch (key) {
        case "left":
            this.x = Math.max(0, this.x - MoveX);
            break;
        case "up":
            this.y = Math.max(-33, this.y - MoveY);
            break;
        case "right":
            this.x = Math.min(404, this.x + MoveX);
            break;
        case "down":
            this.y = Math.min(387, this.y + MoveY);
            break;
    } // switch
    if (this.y <= 0) {
        // victory condition
        this.y = 303;
    }
    console.log(this.x, this.y);
}; // handleInput

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don"t need to modify this.
document.addEventListener("keyup", function (e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    player.handleInput(allowedKeys[e.keyCode]);
}); // keyup event listener

const MoveX = 101;
const MoveY = 84;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [new Enemy()];