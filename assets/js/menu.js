var Menu = {

	preload : function() {
		// Images are loaded to create sprites later
		// First argument is the name of the menu image
		// Second argument is the path to the menu image file
		game.load.image('menu', './assets/images/menu.png');
	},

	create : function () {
		// Add a game sprite, in this case the logo
		// Parameters are : X, Y, image name (see above)
		this.add.sprite(0, 0, 'menu');
	}

};
