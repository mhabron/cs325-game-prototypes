"use strict";

var GameStates = {};

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
			
            background = game.add.sprite(0, 0, 'preloader_background');
            preloadBar = game.add.sprite(300, 400, 'preloader_bar');
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);
    
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            game.load.image('titlePage', 'assets/title-background.png');
            game.load.audio('titleMusic', ['assets/Poppers and Prosecco.mp3']);
            //	+ lots of other required assets here
			game.load.spritesheet('angel', 'assets/player-angel.png', 64, 64);
			game.load.image('bullet1', 'assets/angel-bullet1.png');
			game.load.image('bullet2', 'assets/angel-bullet2.png');
			game.load.image('bullet3', 'assets/angel-bullet3.png');
			game.load.image('bullet4', 'assets/angel-bullet4.png');
			game.load.image('power-up', 'assets/power-up.png');
			game.load.image('gui', 'assets/player-gui.png');
			game.load.spritesheet('enemy', 'assets/demon-enemy.png', 64, 64);
			game.load.spritesheet('boss', 'assets/demon-boss.png', 128, 128); 
			game.load.spritesheet('enemyBullet', 'assets/demon-bullet.png', 32, 32);
			game.load.image('game-background', 'assets/game-background.png');
			game.load.image('boss-health-bar', 'assets/boss-health-bar.png');
			game.load.spritesheet('play-button', 'assets/play-button-combined.png', 200, 64);
			game.load.image('end', 'assets/end-background.png');
        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            preloadBar.cropEnabled = false;
    
        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            if (game.cache.isSoundDecoded('titleMusic') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
