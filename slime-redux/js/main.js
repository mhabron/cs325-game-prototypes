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
    

    function preload() {
        game.load.image('red', 'assets/red-slime.png', 32, 32);
		game.load.image('dark-blue', 'assets/dark-blue-slime.png', 32, 32);
		game.load.image('light-blue', 'assets/blue-slime.png', 32, 32);
		game.load.image('yellow', 'assets/yellow-slime.png', 32, 32);
		game.load.image('green', 'assets/green-slime.png', 32, 32);
		game.load.image('smile', 'assets/green-slime-smiling.png', 32, 32);
		game.load.image('nose', 'assets/blue-slime-nose.png', 32, 32);
		game.load.audio('splat', 'assets/Bir Poop Splat.mp3');
		game.load.audio('wrong', 'assets/Wrong-answer-sound-effect.mp3');
		game.load.audio('bgm','assets/Puyo-puyo-theme.mp3');
    }
	
	var playerOneScore = 0;
	var playerTwoScore = 0;
	var playerOneScoreString = ' ';
	var playerTwoScoreString = ' ';
	var playerOneText;
	var playerTwoText;
	var slimes;
	var timeLimit = 3600;
	
	var music;
	var soundfxOne;
	var soundfxTwo;
	var playerOneActive = true;
	var rightSlimeCreated = false;
	var lookForText;
	var searchSlime;
	var searchSlimeString;
	var wrongSlimeOne;
	var wrongSlimeTwo;
	var wrongSlimeThree;
	var wrongSlimeFour;
	var timerActive;
	var timerText;
	var rightSlimes;
	var slimeTimer = 0;
	var finalRound = false;
    
    function create() {
		slimes = game.add.group();
		rightSlimes = game.add.group();
		
		slimes.inputEnableChildren = true;
		rightSlimes.inputEnableChildren = true;
		
		lookForText = game.add.text(game.world.centerX - 100, game.world.centerY + 200, 'P1, Look for: ', {font: '34px Impact'});
		lookForText.addColor('#fff', 0);
		
		chooseSlime();
		game.time.events.add(Phaser.Timer.SECOND * 4, createSlimes, this);
		game.time.events.add(Phaser.Timer.SECOND * 4, setTimer, this);
		
		slimes.onChildInputDown.add(wrongSlimeClicked, this);
		rightSlimes.onChildInputDown.add(rightSlimeClicked, this);
		
		playerOneScoreString = 'P1 Score: ';
		playerOneText = game.add.text(10,10, playerOneScoreString + playerOneScore, {font: '34px Impact'});
		playerOneText.addColor('#fff', 0);
		
		playerTwoScoreString = 'P2 Score: ';
		playerTwoText = game.add.text(game.world.width - 250, 10, playerTwoScoreString + playerTwoScore, {font: '34px Impact'});
		playerTwoText.addColor('#fff', 0);
		
		timerText = game.add.text(game.world.centerX - 60, 10, 'Time Left: ' + Math.floor(timeLimit / 60), {font: '34px Impact'});
		timerText.addColor('#fff', 0);
		music = game.add.audio('bgm');
		music.play();
		music.loop = true;
    }
	
	function createSlimes() {
		var realSlimePlace = game.rnd.integerInRange(0, 49);
		for (var y = 0; y < 5; y++) {
			for (var x = 0; x < 10; x++) {
				if ((realSlimePlace == (y * 10 + x)) && (rightSlimeCreated == false)) {
					var rightSlime = rightSlimes.create(x * 48 + 150, y * 50 + 100, searchSlimeString);
					rightSlimeCreated = true;
				}
				else {
					var num = game.rnd.integerInRange(0,3);
					if (num == 0) {
						var slime = slimes.create(x * 48 + 150, y * 50 + 100, wrongSlimeOne);
					}
					else if (num == 1) {
						var slime = slimes.create(x * 48 + 150, y * 50 + 100, wrongSlimeTwo);
					}
					else if (num == 2) {
						var slime = slimes.create(x * 48 + 150, y * 50 + 100, wrongSlimeThree);
					}
					else if (num == 3) {
						var slime = slimes.create(x * 48 + 150, y * 50 + 100, wrongSlimeFour);
					}
				}
			}
		}
	}
	
    function update() {
		if (timerActive == true){
			timeLimit -= 1;
			timerText.text = 'Time Left :' + Math.floor(timeLimit/60);
		}
		if (timeLimit <= 0) {
			timerActive = false;
			timerUp();
		}
		if ((game.time.now >= slimeTimer) && timerActive == true) {
			rightSlimeCreated = false;
			slimes.destroy(true,true);
			rightSlimes.destroy(true,true);
			createSlimes();
			slimeTimer = game.time.now + 3000;
		}
    }
	function setTimer() {
		slimeTimer = game.time.now + 3000;
		timerActive = true;
	}
	function timerUp() {
		timeLimit = 3600;
		slimes.destroy(true,true);
		rightSlimes.destroy(true,true);
		rightSlimeCreated = false;
		if (playerOneActive == true) {
			playerOneActive = false;
			lookForText = game.add.text(game.world.centerX - 10, game.world.centerY, 'P2, Look for: ', {font: '34px Impact'});
			lookForText.addColor('#fff', 0);
			chooseSlime();
			game.time.events.add(Phaser.Timer.SECOND * 3, createSlimes, this);
			game.time.events.add(Phaser.Timer.SECOND * 3, setTimer, this);
		}
		else {
			if (playerOneScore > playerTwoScore) {
				lookForText = game.add.text(game.world.centerX - 100, game.world.centerY - 50, 'Times Up! P1 Wins!', {font: '34px Impact'});
				lookForText.addColor('#fff', 0);
			}
			else if (playerOneScore < playerTwoScore) {
				lookForText = game.add.text(game.world.centerX - 100, game.world.centerY - 50, 'Times Up! P2 Wins!', {font: '34px Impact'});
				lookForText.addColor('#fff', 0);
			}
			else {
				lookForText = game.add.text(game.world.centerX - 100, game.world.centerY - 50, 'Times Up! Tie!', {font: '34px Impact'});
				lookForText.addColor('#fff', 0);
			}
			game.time.events.add(Phaser.Timer.SECOND * 3, gameReset, this);
		}
	}
	function wrongSlimeClicked() {
		timeLimit -= 60;
		soundfxOne = game.add.audio('wrong');
		soundfxOne.play();
	}
	function rightSlimeClicked() {
		if (playerOneActive == true) {
			playerOneScore += 1;
			playerOneText.text = playerOneScoreString + playerOneScore;
		}
		else {
			playerTwoScore += 1;
			playerTwoText.text = playerTwoScoreString + playerTwoScore;
		}
		soundfxTwo = game.add.audio('splat');
		soundfxTwo.play();
		rightSlimeCreated = false;
		slimes.destroy(true,true);
		rightSlimes.destroy(true,true);
		chooseSlime();
		createSlimes();
		slimeTimer = game.time.now + 3000;
	}
	function chooseSlime() {
		var chooseSlimeNum = game.rnd.integerInRange(0, 4);
		if(searchSlime != null) {
			searchSlime.destroy();
		}
		if (chooseSlimeNum == 0) {
			searchSlime = game.add.sprite(game.world.centerX + 100, game.world.centerY + 200, 'light-blue');
			searchSlimeString  = 'light-blue';
			wrongSlimeOne = 'dark-blue';
			wrongSlimeTwo = 'red';
			wrongSlimeThree = 'green';
			wrongSlimeFour = 'yellow';
		}
		else if (chooseSlimeNum == 1) {
			searchSlime = game.add.sprite(game.world.centerX + 100, game.world.centerY + 200, 'dark-blue');
			searchSlimeString  = 'dark-blue';
			wrongSlimeOne = 'light-blue';
			wrongSlimeTwo = 'red';
			wrongSlimeThree = 'green';
			wrongSlimeFour = 'yellow';
		}
		else if (chooseSlimeNum == 2) {
			searchSlime = game.add.sprite(game.world.centerX + 100, game.world.centerY + 200, 'red');
			searchSlimeString  = 'red';
			wrongSlimeOne = 'light-blue';
			wrongSlimeTwo = 'dark-blue';
			wrongSlimeThree = 'green';
			wrongSlimeFour = 'yellow';
		}
		else if (chooseSlimeNum == 3) {
			searchSlime = game.add.sprite(game.world.centerX + 100, game.world.centerY + 200, 'green');
			searchSlimeString  = 'green';
			wrongSlimeOne = 'light-blue';
			wrongSlimeTwo = 'dark-blue';
			wrongSlimeThree = 'red';
			wrongSlimeFour = 'yellow';
		}
		else  {
			searchSlime = game.add.sprite(game.world.centerX + 100, game.world.centerY + 200, 'yellow');
			searchSlimeString  = 'yellow';
			wrongSlimeOne = 'light-blue';
			wrongSlimeTwo = 'dark-blue';
			wrongSlimeThree = 'red';
			wrongSlimeFour = 'green';
		}
	}
	function gameReset() {
		playerOneScore = 0;
		playerTwoScore = 0;
		timeLimit = 3600;
		timerText.text = "Time Left: " + Math.floor(timeLimit/60);
		playerOneText.text = playerOneScoreString + playerOneScore;
		playerTwoText.text = playerTwoScoreString + playerTwoScore;
		lookForText = game.add.text(game.world.centerX - 100, game.world.centerY + 200, 'P1, Look for: ', {font: '34px Impact'});
		lookForText.addColor('#fff', 0);
		playerOneActive = true;
		
		rightSlimeCreated = false;
		game.time.events.add(Phaser.Timer.SECOND * 4, createSlimes, this);
		game.time.events.add(Phaser.Timer.SECOND * 4, setTimer, this);
	}
};
