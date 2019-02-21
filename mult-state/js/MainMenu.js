"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var music;
	var playButton;
    
    function startGame(pointer) {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        music.stop();

        //	And start the actual game
        game.state.start('Game');

    }
    
    return {
    
        create: function () {
    
    
            music = game.add.audio('titleMusic');
            music.play();
			music.loop = true;
    
            game.add.sprite(0, 0, 'titlePage');
    
            playButton = game.add.button(300,440,'play-button', startGame, this, 1, 0, 2);
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
