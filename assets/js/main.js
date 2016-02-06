var game;

//Create a new game instance 600px wide and 450px tall
game = new Phaser.Game(600, 450, Phaser.AUTO, '');

// First parameter calls state
// Second Parmeter creates an object containing methods for state functionality
game.state.add('Menu', Menu);

//Adds a game state.
game.state.add('Game', Game);

game.state.start('Menu');

// Adds a game over state.
game.state.add('Game_Over', Game_Over);