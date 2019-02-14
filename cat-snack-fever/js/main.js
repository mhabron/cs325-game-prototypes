"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    var PhaserGlobal;
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
	//loads all necessary assets into the game.
    function preload() {
        game.load.spritesheet( 'cat', 'assets/cat-enemy.png', 64, 64);
		game.load.image( 'player', 'assets/treat-bag-player.png');
		game.load.spritesheet( 'bullet', 'assets/snack-bullet.png', 64, 64);
		game.load.spritesheet( 'enemyBullet', 'assets/paw-enemy-bullet-small.png', 64, 64);
		game.load.image('background', 'assets/background.png');
		game.load.audio('neko', 'assets/01 - Mitchiri-Neko March.mp3');
		game.load.audio('meow', 'assets/cat-meowing.mp3');
    }
    var playerBag;
	var catEnemies;
	var bulletSnacks;
	var bullet;
	var bulletPaws;
	var bulletTime = 0;
	var keys;
	var fireButton;
	var score = 0;
	var scoreString = '';
	var scoreText;
	var lives;
	var live;
	var enemyBullet;
	var background;
	var firingTimer = 0;
	var spawnTimer = 0;
	var music;
	var soundfx;
	var livingEnemies = [];
	
    //mostly borrowed/modified from the "Invaders" example.
    function create() {
		background = game.add.tileSprite(0, 0, 800, 600, 'background');
		
		bulletSnacks = game.add.group();
		bulletSnacks.enableBody = true;
		bulletSnacks.physicsBodyType = Phaser.Physics.ARCADE;
		bulletSnacks.createMultiple(20, 'bullet', [0,1]);
		bulletSnacks.setAll('anchor.x', 0.5);
		bulletSnacks.setAll('anchor.y', 1);
		bulletSnacks.setAll('outOfBoundsKill', true);
		bulletSnacks.setAll('checkWorldBounds', true);
		
		bulletPaws = game.add.group();
		bulletPaws.enableBody = true;
		bulletPaws.physicsBodyType = Phaser.Physics.ARCADE;
		bulletPaws.createMultiple(20, 'enemyBullet', [0,1,2,3]);
		bulletPaws.setAll('anchor.x', 0.5);
		bulletPaws.setAll('anchor.y', 1);
		bulletPaws.setAll('outOfBoundsKill', true);
		bulletPaws.setAll('checkWorldBounds', true);
		
		playerBag = game.add.sprite(400, 500, 'player');
		playerBag.anchor.setTo(0.5, 0.5);
		game.physics.enable(playerBag, Phaser.Physics.ARCADE);
		
		catEnemies = game.add.group();
		catEnemies.enableBody = true;
		catEnemies.physicsBodyType = Phaser.Physics.ARCADE;
		catEnemies.createMultiple(100, 'cat', [0,1,2,3]);
		catEnemies.setAll('outofBoundsKill', true);
		catEnemies.setAll('checkWorldBounds', true);
		
		music = game.add.audio('neko');
		music.play();
		music.loop = true;
		
		
		//instead of creating a bunch of aliens like in "Invader", randomly
		//generates a cat enemy somewhere at the top of the screen.
		createCat();
		
		//creates the score counter at the top left corner.
		scoreString = 'Score: ';
		scoreText = game.add.text(10,10, scoreString + score, {font: '34px Arial'});
		
		lives = game.add.group();
		game.add.text(game.world.width - 100, 10, 'Lives: ', {font: '34px Arial'});
		
		
		//creates the lives counter at the top right corner.
		for (var i = 0; i < 3; i++) {
			var bag = lives.create(game.world.width - 100 + (30 * i), 60, 'player');
			bag.anchor.setTo(0.5, 0.5);
			bag.angle = 0;
			bag.alpha = 0.4;
		}
		//  Adds some controls to play the game with
		keys = game.input.keyboard.createCursorKeys();
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
    }
	
	//original function to create a cat enemy at the top of the screen.
    function createCat() {
		var cat = catEnemies.getFirstExists(false);
		cat.reset(game.rnd.integerInRange(200,600), 0)
		cat.animations.add('move', [0,1,2,3], 5, true);
		cat.play('move');
		cat.body.velocity.y = 100;
		spawnTimer = game.time.now + 2000;
		livingEnemies.push[cat];
	}
    function update() {
		//scrolls the background
        background.tilePosition.y += 2;
		if (playerBag.alive) {
			playerBag.body.velocity.setTo(0, 0);
			//enables movement when arrow keys are pressed.
			if (keys.left.isDown) {
				playerBag.body.velocity.x = -200;
			}
			else if (keys.right.isDown) {
				playerBag.body.velocity.x = 200;
			}

			//  Firing?
			if (fireButton.isDown) {
				fireBullet();
			}
			//creates another cat enemy if the game time now aligns with the set timer.
			if (game.time.now > spawnTimer) {
				createCat();
			}
			//  Run collision
			game.physics.arcade.overlap(bulletSnacks, catEnemies, collisionHandler, null, this);
			game.physics.arcade.overlap(catEnemies, playerBag, enemyHitsPlayer, null, this);
		}
    }
	
	//collision handler for when a bullet hits a cat.
	function collisionHandler (bullet, cat) {

		bullet.kill();
		cat.kill();
        soundfx = game.add.audio('meow');
		soundfx.play();
		score += 50;
		scoreText.text = 'Score: ' + score;
	}
    
	//collision handler for when a cat hits the player. Borrowed/modified from "Invader".
	function enemyHitsPlayer (player,cat) {
		cat.kill();
        soundfx = game.add.audio('meow');
		soundfx.play();
		live = lives.getFirstAlive();

		if (live) {
			live.kill();
		}

    // When the player dies
		if (lives.countLiving() < 1) {
			playerBag.reset(400,500);
			bulletPaws.callAll('kill');
			score = 0;
		    scoreText.text = 'Score: ' + score
			for (var i = 0; i < 3; i++) {
				var bag = lives.create(game.world.width - 100 + (30 * i), 60, 'player');
				bag.anchor.setTo(0.5, 0.5);
				bag.angle = 0;
				bag.alpha = 0.4;
			}
		}
	}
	
	//function for firing a bullet from the player. Borrowed/modified from "Invader".
	function fireBullet () {
		if (game.time.now > bulletTime) {
			bullet = bulletSnacks.getFirstExists(false);
			if (bullet) {
				bullet.reset(playerBag.x, playerBag.y + 8);
				bullet.body.velocity.y = -400;
				bulletTime = game.time.now + 200;
			}
		}
	}
	
	//erases a bullet if it goes out of bounds.
	function resetBullet(bullet) {
		bullet.kill();
	}
	
	//erases a cat if it goes out of bounds.
	function resetCat(cat) {
		livingEnemies.pop(cat);
		cat.kill();
	}
};
