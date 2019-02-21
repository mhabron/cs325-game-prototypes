"use strict";

GameStates.makeEndScreen = function( game ) {
	var endBackground;
	var music;
	
    return {
    
        create: function () {
    
			//plays the ending music and creates the end screen background.
            endBackground = game.add.sprite(0, 0, 'end');
			music = game.add.audio('endMusic');
			music.play();
			music.loop = true;
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
