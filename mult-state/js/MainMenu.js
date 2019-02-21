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
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            music = game.add.audio('titleMusic');
            music.play();
    
            game.add.sprite(0, 0, 'titlePage');
    
            playButton = game.add.button(300,440,'play-button', startGame, this, 1, 0, 2);
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};