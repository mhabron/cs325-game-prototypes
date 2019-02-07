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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.spritesheet( 'cat', 'assets/cat-enemy.png', 64, 64);
		game.load.image( 'player', 'assets/treat-bag-player.png');
		game.load.spritesheet( 'bullet', 'assets/snack-bullet.png', 64, 64);
		game.load.spritesheet( 'enemyBullet', 'assets/paw-enemy-bullet-small.png', 64, 64);
		game.load.image('background', 'assets/background.png');
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
	var enemyBullet;
	var background;
	var firingTimer = 0;
	var spawnTimer = 0;
	var livingEnemies = [];
	
    
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
		
		createCat();
		
		scoreString = 'Score: ';
		game.add.text(10,10, scoreString + score, {font: '34px Arial'});
		
		lives = game.add.group();
		game.add.text(game.world.width - 100, 10, 'Lives: ', {font: '34px Arial'});
		
		for (var i = 0; i < 3; i++) {
			var bag = lives.create(game.world.width - 100 + (30 * i), 60, 'player');
			bag.anchor.setTo(0.5, 0.5);
			bag.angle = 90;
			bag.alpha = 0.4;
		}
		//  And some controls to play the game with
		keys = game.input.keyboard.createCursorKeys();
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
    }
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
        background.tilePosition.y += 2;
		if (playerBag.alive) {
			playerBag.body.velocity.setTo(0, 0);
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

			if (game.time.now > firingTimer) {
				enemyFires();
			}
			if (game.time.now > spawnTimer) {
				createCat();
			}
			//  Run collision
			game.physics.arcade.overlap(bulletSnacks, catEnemies, collisionHandler, null, this);
			game.physics.arcade.overlap(bulletPaws, playerBag, enemyHitsPlayer, null, this);
		}
    }
	function collisionHandler (bullet, cat) {

		//  When a bullet hits an alien we kill them both
		bullet.kill();
		cat.kill();

		//  Increase the score
		score += 50;
	}

	function enemyHitsPlayer (player,bullet) {
		bullet.kill();

		live = lives.getFirstAlive();

		if (live) {
			live.kill();
		}

    // When the player dies
		if (lives.countLiving() < 1) {
			player.kill();
			bulletPaws.callAll('kill');
		}
	}
	
	function enemyFires () {
		//  Grab the first bullet we can from the pool
		enemyBullet = bulletPaws.getFirstExists(false);
		if (enemyBullet && livingEnemies.length > 0) {
        
			var random=game.rnd.integerInRange(0,livingEnemies.length-1);

			// randomly select one of them
			var shooter=livingEnemies[random];
			// And fire the bullet from this enemy
			enemyBullet.reset(shooter.body.x, shooter.body.y);

			game.physics.arcade.moveToObject(enemyBullet,playerBag,120);
			firingTimer = game.time.now + 1500;
		}
	}
	
	function fireBullet () {
		//  To avoid them being allowed to fire too fast we set a time limit
		if (game.time.now > bulletTime) {
			//  Grab the first bullet we can from the pool
			bullet = bulletSnacks.getFirstExists(false);
			if (bullet) {
				//  And fire it
				bullet.reset(playerBag.x, playerBag.y + 8);
				bullet.body.velocity.y = -400;
				bulletTime = game.time.now + 200;
			}
		}
	}
	
	function resetBullet(bullet) {
		bullet.kill();
	}
	
	function resetCat(cat) {
		livingEnemies.pop(cat);
		cat.kill();
	}
};
