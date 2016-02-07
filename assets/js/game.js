var snake, apple, squareSize, score, speed, updateDelay,
    direction, new_direction, addNew, 
    cursors, scoreTextValue, speedTextValue,
    textStyle_Key, textStyle_value;
    
var Game = {
    
    preload : function() {
        //Load level resources.
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
    },
    
    create : function() {
        
        //Setting up the previous global variables.
        //It's necessary to have them globally so they can be altered by the update function.
        
        snake= [];               //A stack containing the parts of the snake.
        apple = {};              //An object for the apple.
        squareSize = 15;         //Width and height for the squares. Image is 15x15 pixels.
        score = 0;               //Game score.
        speed = 0;               //Game speed.
        updateDelay = 0;         //To regulate update rates.
        direction = 'right';     //Snake direction.
        new_direction = null;    //New direction storage.
        addNew = false;          //Make the snake longer when the apple is eaten.
        
        //Set up Phaser controler for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();
        
        game.stage.backgroundColor = '#061f27';
        
        //Generate initial snake stack. Snake's initial length = 10.
        //Beginning at X=150 Y=150 and increasing X on every iteration.
        for (var i = 0; i <10; i++) {
            //Parameter are: x-coodrinates, y-coordinates and image.
            snake[i] = game.add.sprite(150 + i * squareSize, 150, 'snake');
        }
        
        //Generate first apple.
        this.generateApple();
        
        //Add text to top of game.
        textStyle_Key = {
            font: "bold 14px sans-serif",
            fill: "#46c0f9",
            align: "center"
        };
        
        textStyle_value = {
            font: "bold 18px sans-serif",
            fill: "#fff",
            align: "center"
        };
        
        //Score.
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_value);
        //Speed.
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_value);
        
    },
    
    update : function() {
        //Updates the game screen.
        //Handle arrow key presses, while not allowing illegal direction changes that will kill the player.
        
        if (cursors.right.isDown && direction != 'left') {
            new_direction = 'right';
        } else if (cursors.left.isDown && direction != 'right') {
            new_direction = 'left';
        } else if (cursors.up.isDown && direction != 'down') {
            new_direction = 'up';
        } else if (cursors.down.isDown && direction != 'up') {
            new_direction = 'down';
        }
        
        //A formula to calculate game speed based on the score.
        //Higher score = higher speed. Speed limit is 10;
        speed = Math.min(10, Math.floor(score / 5));
        //Update speed value on game screen.
        speedTextValue.text = ' ' + speed;
        
        //Phaser's update function has an update rate of 60 FPS.
        //Slow down FPS using updateDelay variable to make the game playable.
        
        //Increase a counter on every update call.
        updateDelay++;
        
        //Change things on the screen only if the reminder of updateDelay
        // and 10 - speed is equal to 0. That will make the snake appear to move
        // after a certain number of FPS.
        if (updateDelay % (10 - speed) == 0) {
            
            //Snake movement.
            
            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;
            
            if (new_direction) {
                direction = new_direction;
                new_direction = null;
            }
            
            // Change the last cell's coordinates relative the the head of the snake, according to the direction.
            if (direction == 'right') {
                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            } else if (direction == 'left') {
                lastCell.x = firstCell.x - 15;
                lastCell.y =firstCell.y;
            } else if (direction == 'up') {
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            } else if (direction == 'down') {
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }
            
            // Place the last cell at the front of the stack.
            // Make it the first cell.
            
            snake.push(lastCell);
            firstCell = lastCell;
            
            //End of snake movement
        
        // Increase the snake's length when eating an apple.
        // Create a block on the position of the last block.
        // (because the last block will move to the front of the snake).
        
        if (addNew) {
            snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
            addNew = false;
        }
        
        // Check for apple collision.
        this.appleCollision();
        
        // Check for collision with self. Parameter is the head of the snake.
        this.selfCollision(firstCell);
        
        // Check collision with wall. Parameter is the head of the snake.
        this.wallCollision(firstCell);
            
        }  // End of if statement.
        
        
    },
    
    appleCollision : function() {
        // Check if any part of the snake is overlapping the apple.
        // This is needed if the apple spawns inside of the snake.
        for (var i = 0; i < snake.length; i++) {
            if (snake[i].x == apple.x && snake[i].y == apple.y) {
                // Add new block to snake the next time it moves.
                addNew = true;
                // Destroy old apple.
                apple.destroy();
                // Make new apple.
                this.generateApple();
                //Increase score
                score++;
                //Update scoreboard.
                scoreTextValue.text = score.toString();
            }
        }  // End of for loop.
    
    },
    
    selfCollision : function(head) {
        //Check if the head overlaps any part of the snake.
        for (var i = 0; i < snake.length - 1; i++) {
            if (head.x == snake[i].x && head.y == snake[i].y) {
                // If so: GAME OVER!
                game.state.start('Game_Over');
            }
        }
    },
    
    wallCollision : function(head) {
        // Check if the head of the snake is within the game screen.
        if(head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0) {
            // If the snake hit the wall: GAME OVER!
            game.state.start('Game_Over');
        }
    },
    
    generateApple : function() {
        //Start at random place in the grid (screen).
        //X between 0 and 585 (39*15)
        //Y between 0 and 435 (29*15)
        
        var randomX = Math.floor(Math.random() * 40) * squareSize,
            randomY = Math.floor(Math.random() * 30) * squareSize;
        
        //Add new apple.
        apple = game.add.sprite(randomX, randomY, 'apple');
    }
    
    
    
};
