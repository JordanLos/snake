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
}
