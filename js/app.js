        var allEnemies, player, tileHeight, tileWidth, player;

        //Position is a parent constructor function that takes three arguments x position , y poition and sprite . this function is inherited by both Enemy and Player classes/function constructors
        var Position = function (x, y, sprite) {
          this.sprite = sprite;
          this.x = x;
          this.y = y;
        };

        //render is common to both Enemy and Player objects
        Position.prototype.render = function () {
          ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

        };

        //hasCollision checks if the collision between the player and enemy has happened , if yes it returns true;
        Position.prototype.hasCollision = function (enemy) {

          //If the enemy and player are with in a distance of 50 pixels left and right along x axis and 0 and 30 px along Y axis, collision occur    
          if ((enemy.x - this.x >= -50 && enemy.x - this.x <= 50) && (enemy.y - this.y >= -50 && enemy.y - this.y <= 50)) {
            return true;
          }

        };

        /************ Enemy function constructors and prototype methods ************************/

        // Enemies our player must avoid
        var Enemy = function (y) {
          var sprite = 'images/enemy-bug.png';
          Position.call(this, 0, y, sprite);
          this.speed = Math.floor((Math.random() * 3) + 1);
        };

        // create a new enemy object and set the prototype to the Position function constructors prototype
        Enemy.prototype = Object.create(Position.prototype);
        //reset back Enemy constructor to Enemy
        Enemy.constructor = Enemy;

        // Update the enemy's position, required method for game
        // Parameter: dt, a time delta between ticks
        Enemy.prototype.update = function (dt) {
          // You should multiply any movement by the dt parameter
          // which will ensure the game runs at the same speed for
          // all computers. 
          this.x = this.x + (this.speed * Math.floor(dt * 200));

          if (this.x > 600) {
            this.x = 0;
            this.speed = Math.floor((Math.random() * 3) + 1);
          }
        };


        /************************ Player Function Constructor and prototype Methods*************************/
        //Player function constructor 
        var Player = function (x, y) {
          var sprite = 'images/char-boy.png';
          Position.call(this, x, y, sprite);
        }

        // create a  new empty Player object and set the prototype to the Position function constructors prototype
        Player.prototype = Object.create(Position.prototype);
        //reset back Enemy constructor to Enemy
        Player.constructor = Player;


        // Now instantiate your objects.
        // Place all enemy objects in an array called allEnemies
        // Place the player object in a variable called player

        allEnemies = [new Enemy(70), new Enemy(150), new Enemy(230)];
        player = new Player(200, 400);
        tileHeight = 90;
        tileWidth = 100;
        divScore = document.createElement('div');
        score = 0;

        //update function that checks if the player has collided with any of the enemies
        //if yes we will reset the game
        Player.prototype.update = function () {

          for (var i = 0; i < allEnemies.length; i++) {
            if (this.hasCollision(allEnemies[i])) {
              score = 0;
              reset();
            }
          }
          this.displayPlayerScore();

        };


        //reset function is being used to reset the allEnemies and player objects
        function reset() {
          allEnemies = [];
          player = null;
          allEnemies = [new Enemy(60), new Enemy(140), new Enemy(230)];
          player = new Player(200, 400);
          playerYValues = [];

        }

        //function to display the score .this function also sets the font and color of the div element

        Player.prototype.displayPlayerScore = function () {

          var canvasVal = document.body.getElementsByTagName('canvas')[0];
          divScore.innerHTML = '<h3> score: ' + score + '</h3>';
          divScore.style.color = "blue";
          divScore.style.fontFamily = "sans-serif";
          divScore.style.fontSize = "25px";
          document.body.insertBefore(divScore, canvasVal);
        };


        var playerYValues = [];

        //we will handle player moves using the handleInput function
        Player.prototype.handleInput = function (keyInput, e) {
          //reset the game everytime if the y value is less than zero , ie the player is on the top water row, and the user press any left right, down or up arrows 
          if (player.y < 0) {
            reset();
          }
          if (keyInput === 'up' && this.y >= 0) {
            this.y = this.y - tileHeight;
            //if the y value is less than 0 increase the score by 1, the player once reaches the top row
            if (this.y < 0) {
              score = score + 1;
            }
          }
          if (keyInput === 'down' && this.y < 390) {
            this.y = this.y + tileHeight;
          }
          if (keyInput === 'left' && this.x > 0) {
            this.x = this.x - tileWidth;
          }
          if (keyInput === 'right' && this.x <= 300) {
            this.x = this.x + tileWidth;
          }
        }


        /********** Keypress events for down left up and right arrows ******************************/
        // This listens for key presses and sends the keys to your
        // Player.handleInput() method. You don't need to modify this.
        document.addEventListener('keyup', function (e) {
          var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
          };


          player.handleInput(allowedKeys[e.keyCode], e);


        }, true);
