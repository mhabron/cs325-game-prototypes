"use strict";

GameStates.makeEndScreen = function( game ) {
	var endBackground;
	
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            endBackground = game.add.sprite(0, 0, 'end');
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
