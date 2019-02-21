"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
	var playerAngel;
	var live;
	var bullet;
	var bulletTime = 0;
	var powerLevel = 10;
	var powerUps;
	
	var gui;
	
	var healthbar;
	var enemies;
	var spawnTimer;
	var enemyBullets;
	var enemyFire;
	var enemyTime = 0;
	
	var keys;
	var fireButton;
	
	var playerBulletsOne;
	var playerBulletsTwo;
	var playerBulletsThree;
	var playerBulletsFour;
	
	var background;
	
	var score = 0;
	var scoreText;
	
	var powerText;
	var lives;
	
	var music;
	var soundfx;
	
	var bossScore = 20000;
	
	
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('EndScreen');

    }
	
	function fireBullet () {
		if (game.time.now > bulletTime) {
			if(powerLevel == 10) {
				bullet = playerBulletsOne.getFirstExists(false);
			}
			else if(powerLevel == 20) {
				bullet = playerBulletsTwo.getFirstExists(false);
			}
			else if(powerLevel == 30) {
				bullet = playerBulletsThree.getFirstExists(false);
			}
			else {
				bullet = playerBulletsFour.getFirstExists(false);
			}
			if (bullet) {
				bullet.reset(playerAngel.x, playerAngel.y + 8);
				bullet.body.velocity.y = -400;
				bulletTime = game.time.now + 200;
			}
		}
	}
	
	function createDemon() {
		var demon = enemies.getFirstExists(false);
		demon.reset(game.rnd.integerInRange(100,500), -50);
		demon.animations.add('move', [0,1], 7, true);
		demon.play('move');
		demon.body.velocity.y = 400;
		spawnTimer = game.time.now + 1000;
	}
	
	function powerUpCollisionHandler(playerAngel, powerUp) {
		powerUp.kill();
		powerLevel += 10;
		powerText.text = "x" + powerLevel;
		//soundfx = game.add.audio('meow');
		//soundfx.play();
	}
	
	//collision handler for when a bullet hits a cat.
	function collisionHandler (bullet, demon) {
		var dropped = game.rnd.integerInRange(0,1);
		if (dropped == 1 & powerLevel != 40) {
			var powerUp = powerUps.getFirstExists(false);
			powerUp.reset(demon.x, demon.y);
			powerUp.body.velocity.y = 200;
		}
		bullet.kill();
		demon.kill();
        //soundfx = game.add.audio('meow');
		//soundfx.play();
		score += (50 * powerLevel);
		scoreText.text = score + "/ " + bossScore;
	}
	
	//collision handler for when a demon hits the player. Borrowed/modified from "Invader".
	function enemyHitsPlayer (playerAngel,demon) {
		demon.kill();
        soundfx = game.add.audio('meow');
		soundfx.play();
		live = lives.getFirstAlive();
		if (live) {
			live.kill();
		}
		if (lives.countLiving() < 1) {
			game.state.start('MainMenu');
		}
	}
	
	//erases a bullet if it goes out of bounds.
	function resetBullet(bullet) {
		bullet.kill();
	}
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Create a sprite at the center of the screen using the 'logo' image.
            background = game.add.tileSprite(0,0,800,600,'game-background');
			
            playerBulletsOne = game.add.group();
			playerBulletsOne.enableBody = true;
			playerBulletsOne.physicsBodyType = Phaser.Physics.ARCADE;
			playerBulletsOne.createMultiple(50, 'bullet1');
			playerBulletsOne.setAll('anchor.x', 0.5);
			playerBulletsOne.setAll('anchor.y', 1);
			playerBulletsOne.setAll('outOfBoundsKill', true);
			playerBulletsOne.setAll('checkWorldBounds', true);
			
			playerBulletsTwo = game.add.group();
			playerBulletsTwo.enableBody = true;
			playerBulletsTwo.physicsBodyType = Phaser.Physics.ARCADE;
			playerBulletsTwo.createMultiple(50, 'bullet2');
			playerBulletsTwo.setAll('anchor.x', 0.5);
			playerBulletsTwo.setAll('anchor.y', 1);
			playerBulletsTwo.setAll('outOfBoundsKill', true);
			playerBulletsTwo.setAll('checkWorldBounds', true);
			
			playerBulletsThree = game.add.group();
			playerBulletsThree.enableBody = true;
			playerBulletsThree.physicsBodyType = Phaser.Physics.ARCADE;
			playerBulletsThree.createMultiple(50, 'bullet3');
			playerBulletsThree.setAll('anchor.x', 0.5);
			playerBulletsThree.setAll('anchor.y', 1);
			playerBulletsThree.setAll('outOfBoundsKill', true);
			playerBulletsThree.setAll('checkWorldBounds', true);
			
			playerBulletsFour = game.add.group();
			playerBulletsFour.enableBody = true;
			playerBulletsFour.physicsBodyType = Phaser.Physics.ARCADE;
			playerBulletsFour.createMultiple(50, 'bullet4');
			playerBulletsFour.setAll('anchor.x', 0.5);
			playerBulletsFour.setAll('anchor.y', 1);
			playerBulletsFour.setAll('outOfBoundsKill', true);
			playerBulletsFour.setAll('checkWorldBounds', true);
			
			enemies = game.add.group();
			enemies.enableBody = true;
			enemies.physicsBodyType = Phaser.Physics.ARCADE;
			enemies.callAll('body.setSize','',16, 16, 0, 0);
			enemies.createMultiple(100, 'enemy', [0,1]);
			enemies.setAll('outofBoundsKill', false);
			enemies.setAll('checkWorldBounds', true);
			
			enemyBullets = game.add.group();
			enemyBullets.enableBody = true;
			enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
			enemyBullets.createMultiple(50, 'enemyBullet', [0,1,2,3]);
			enemyBullets.setAll('anchor.x', 0.5);
			enemyBullets.setAll('anchor.y', 1);
			enemyBullets.setAll('outOfBoundsKill', true);
			enemyBullets.setAll('checkWorldBounds', true);
			
			powerUps = game.add.group();
			powerUps.enableBody = true;
			powerUps.physicsBodyType = Phaser.Physics.ARCADE;
			powerUps.createMultiple(5, 'power-up');
			powerUps.setAll('anchor.x', 0.5);
			powerUps.setAll('anchor.y', 1);
			powerUps.setAll('outOfBoundsKill', true);
			powerUps.setAll('checkWorldBounds', true);
			
			playerAngel = game.add.sprite(400, 500, 'angel');
			playerAngel.anchor.setTo(0.5, 0.5);
			game.physics.enable(playerAngel, Phaser.Physics.ARCADE);
			//playerAngel.body.setSize(16, 16, 0, 0);
			playerAngel.animations.add('movePlayer', [0,1], 7, true);
			playerAngel.play('movePlayer');
			
			gui = game.add.sprite(650, 0, 'gui');
			
			lives = game.add.group();
			
			//creates the lives counter at the top right corner.
			for (var i = 0; i < 3; i++) {
				var life = lives.create(game.world.width - 100 + (30 * i), 120, 'angel');
				life.anchor.setTo(0.5, 0.5);
				life.angle = 0;
				life.alpha = 0.7;
			}
			
			scoreText = game.add.text(game.world.width - 140,260, score + "/ " + bossScore, {font: '24px Impact'});
			scoreText.addColor('#fff', 0);
			
			powerText = game.add.text(game.world.width - 100,400, "x" + powerLevel, {font: '34px Impact'});
			powerText.addColor('#fff', 0);
			
			//  Adds some controls to play the game with
			keys = game.input.keyboard.createCursorKeys();
			fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			
			createDemon();
        },
    
        update: function () {
			background.tilePosition.y += 2;
			if (playerAngel.alive) {
				playerAngel.body.velocity.setTo(0, 0);
			//enables movement when arrow keys are pressed.
			if (keys.left.isDown && playerAngel.x >= 0) {
				playerAngel.body.velocity.x = -300;
			}
			else if (keys.right.isDown && playerAngel.x <= 650) {
				playerAngel.body.velocity.x = 300;
			}

			//  Firing?
			if (fireButton.isDown) {
				fireBullet();
			}
			//creates another cat enemy if the game time now aligns with the set timer.
			if (game.time.now > spawnTimer) {
				createDemon();
			}
			if(score >= bossScore) {
				quitGame();
			}
			//  Run collision
			game.physics.arcade.overlap(playerBulletsOne, enemies, collisionHandler, null, this);
			game.physics.arcade.overlap(playerBulletsTwo, enemies, collisionHandler, null, this);
			game.physics.arcade.overlap(playerBulletsThree, enemies, collisionHandler, null, this);
			game.physics.arcade.overlap(playerBulletsFour, enemies, collisionHandler, null, this);
			game.physics.arcade.overlap(enemies, playerAngel, enemyHitsPlayer, null, this);
			game.physics.arcade.overlap(powerUps, playerAngel, powerUpCollisionHandler, null, this);
			}
        }
    };
};
