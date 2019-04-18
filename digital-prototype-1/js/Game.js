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
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
		player.kill();
		goal_post.kill();

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			map = game.add.tilemap('level1');
			map.addTilesetImage('platformer_32_full', 'tiles');
			
			backgroundLayer1 = map.createLayer('BackgroundLayer');
			groundLayer1 = map.createLayer('GroundLayer');
			
			backgroundSky = game.add.tileSprite(0, 0, 1024, 1024, 'sky');
			map.setCollisionBetween(1, 100, true, 'GroundLayer');
			groundLayer1.resizeWorld();
			
			goal_post = game.add.sprite(3104, 538);
			player = game.add.sprite(64, 576, 'player');
			game.physics.arcade.enable(player);
			
			player.body.gravity.y = 2000;
			player.body.gravity.x = 20;
			
			player.animations.add('idle', [0,1,2], 10, true);
			player.animations.play('idle');
			
			game.camera.follow(player);
			
			/*
			enemies = game.add.group();
			enemies.enableBody = true;
			enemies.physicsBodyType = Phaser.Physics.ARCADE;
			enemies.createMultiple(10, 'cat', [0,1,2,3]);
			enemies.setAll('outofBoundsKill', true);
			enemies.setAll('checkWorldBounds', true);
			*/
			
			keys = game.input.keyboard.createCursorKeys();
			fireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
			attackButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
			
        },
		
		player_gets_goal: function (goal_post, player) {
			quitGame();
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
			if (keys.right.isDown) {
				player.body.velocity.x = 200;
			}
			game.physics.arcade.overlap(goal_post, player, player_gets_goal, null, this);
			
        }
    };
};
