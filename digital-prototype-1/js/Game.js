"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
	var backgroundSky;
	var map;
	var backgroundLayer1;
	var groundLayer1;
	var goal_post;
	var player;
	var enemies;
	var keys;
	var attackButton;
	var fireButton;
	var sword;
	var star;
	var hasSword = false;
	var hasRanged = false;
	var bulletTime = 0;
	var isAttacking = false;
	var enemy1;
	var enemy2;
	var enemy3;
	var stars;
	var starBullet;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
		player.kill();
		goal_post.kill();
		hasSword = false;
		hasRanged = false;
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
	
	function player_gets_goal(goal_post, player) {
		quitGame();
	}
	function player_gets_sword(sword, player) {
		sword.kill();
		hasSword = true;
	}
	function player_gets_star(throwing_star, player) {
		throwing_star.kill();
		hasRanged = true;
	}
	function starHitsEnemy(thrown_star, enemy) {
		thrown_star.kill();
		enemy.kill();
	}
	function enemyPlayerCollision(player, enemy) {
		if (isAttacking) {
			enemy.kill();
		}
		else{
			player.reset(enemy.x - 10, enemy.y);
		}
	}
	function attack() {
		if (isAttacking == false) {
			player.animations.play('attack');
			isAttacking = true;
			game.time.events.add(Phaser.Timer.SECOND * 1, function(){player.animations.play('idle'), isAttacking = false}, this);
		}
	}
	function fireStar() {
		if (game.time.now > bulletTime) {
			starBullet = stars.getFirstExists(false);
			if (starBullet) {
				starBullet.reset(player.x + 2, player.y);
				starBullet.body.velocity.x = 400;
				bulletTime = game.time.now + 400;
			}
		}
	}
	function resetPlayer() {
		player.reset(64, 576);
	}
    
    return {
    
        create: function () {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.stage.backgroundColor = '#a9f0ff';
			map = game.add.tilemap('level1');
			map.addTilesetImage('platformer_32_full', 'tiles');
			
			backgroundLayer1 = map.createLayer('Background Layer');
			groundLayer1 = map.createLayer('Ground Layer');
			

			map.setCollisionBetween(1, 100, true, 'Ground Layer');
			groundLayer1.resizeWorld();
			
			goal_post = game.add.sprite(3104, 538, 'goal');
			sword = game.add.sprite(496, 560, 'sword');
			throwing_star = game.add.sprite(1336 ,676, 'throwing_star');
			player = game.add.sprite(64, 576, 'player');
			game.physics.arcade.enable(player);
			game.physics.arcade.enable(sword);
			game.physics.arcade.enable(throwing_star);
			game.physics.arcade.enable(goal_post);
			
			player.body.gravity.y = 2000;
			
			player.animations.add('idle', [0,1,2], 5, true);
			player.animations.add('attack', [42,43,44,45,46,47,48], 10);
			player.animations.play('idle');
			player.checkWorldBounds = true;
			player.events.onOutOfBounds.add(resetPlayer, this);
			
			game.camera.follow(player);
			
			
			stars = game.add.group();
			stars.enableBody = true;
			stars.physicsBodyType = Phaser.Physics.ARCADE;
			stars.createMultiple(20, 'throwing_star');
			stars.setAll('anchor.x', 0.5);
			stars.setAll('anchor.y', 1);
			stars.setAll('outOfBoundsKill', true);
			stars.setAll('checkWorldBounds', true);
			
			enemies = game.add.group();
			enemies.enableBody = true;
			enemies.physicsBodyType = Phaser.Physics.ARCADE;
			enemies.createMultiple(10, 'cat', [0,1,2,3]);
			enemies.setAll('outofBoundsKill', true);
			enemies.setAll('checkWorldBounds', true);
			
			
			keys = game.input.keyboard.createCursorKeys();
			fireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
			attackButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
			
			enemy1 = enemies.getFirstExists(false);
			enemy1.animations.add('cat_idle', [0,1,2,3], 5, true);
			enemy1.animations.play('cat_idle');
			enemy1.reset(2176, 538);
			
			enemy2 = enemies.getFirstExists(false);
			enemy2.animations.add('cat_idle', [0,1,2,3], 5, true);
			enemy2.animations.play('cat_idle');
			enemy2.reset(1540, 526);
			
			enemy3 = enemies.getFirstExists(false);
			enemy3.animations.add('cat_idle', [0,1,2,3], 5, true);
			enemy3.animations.play('cat_idle');
			enemy3.reset(832, 614);
			
        },
		
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
			game.physics.arcade.collide(player, groundLayer1);
			if (keys.up.isDown) {
				player.body.velocity.y = -500;
			}
			if (keys.left.isDown) {
				player.body.velocity.x = -200;
			}
			else if (keys.right.isDown) {
				player.body.velocity.x = 200;
			}
			else {
				player.body.velocity.x = 0;
			}
			if(fireButton.isDown && hasRanged == true){
				fireStar();
			}
			if(attackButton.isDown && hasSword == true) {
				attack();
			}
			game.physics.arcade.overlap(goal_post, player, player_gets_goal, null, this);
			game.physics.arcade.overlap(throwing_star, player, player_gets_star, null, this);
			game.physics.arcade.overlap(sword, player, player_gets_sword, null, this);
			game.physics.arcade.overlap(stars, enemies, starHitsEnemy, null, this);
			game.physics.arcade.overlap(player, enemies, enemyPlayerCollision, null, this);
        }
    };
};
