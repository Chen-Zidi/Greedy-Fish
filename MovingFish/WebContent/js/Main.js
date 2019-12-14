//using Chrome is the best
//using IE may causes some problems (the music would stop in some cases)
window.game = new Phaser.Game(800, 600, Phaser.AUTO, "game");

var actor;

var fishes0;
var fishes1;
var fishes2;
var fishes3;
var ground;
var fishHooks;
var grasses;
var coins;

var soundStatus = 0;

var score = 0;
var goal;
var level = 2;

var scoreText;
var progressText;
var informationText;
var infoSprites;
var infoPic1;
var infoPic2;
var infoPic3;
var infoPic4;

var onmusic = 0;
var backgroundMusic;
var difficulty = 0;
var soundButton;
var pauseText;
var pauseButton;

//main state of the game
var MainState = {

	preload : function() {
		// document.body.style.cursor = "none";
		game.stage.backgroundColor = '#58a7e8';

		//load images
		game.load.image('fish0', 'assets/main images/fish0.png');
		game.load.image('fish1', 'assets/main images/fish1.png');
		game.load.image('fish2', 'assets/main images/fish2.png');
		game.load.image('fish3', 'assets/main images/fish3.png');
		game.load.image('dead1', 'assets/main images/dead1.png');
		game.load.image('dead2', 'assets/main images/dead2.png');
		game.load.image('dead3', 'assets/main images/dead3.png');
		game.load.image('fishHook', 'assets/main images/fish_hook.png');
		game.load.image('grass', 'assets/main images/grass.png');
		game.load.image('ground', 'assets/main images/ground.png');
		game.load.image('goal', 'assets/main images/flag.png');
		game.load.image('restart', 'assets/function images/restart.png');
		game.load.spritesheet('sound', 'assets/function images/sound.png', 48,
				48, 2);
		game.load.spritesheet('pause', 'assets/function images/pause.png', 48,
				48);
		game.load.spritesheet('actor', 'assets/main images/actor.png', 107, 80,
				2);

		
		//load musics
		game.load.audio('jump', 'assets/music/waterReentry.wav');
		game.load.audio('eat', 'assets/music/eating.wav');
		game.load.audio('scream', 'assets/music/scream.wav');

	},

	create : function() {

		game.world.setBounds(0, 0, 20000, 550);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// add sounds
		this.jumpSound = game.add.audio('jump');
		this.jumpSound.volume = 0.2;

		this.eatSound = game.add.audio('eat');
		this.eatSound.volume = 0.2;

		this.screamSound = game.add.audio('scream');
		this.screamSound.volume = 0.2;

		// create actors and actor groups
		infoSprites = game.add.group();

		goal = game.add.sprite(19800, 20, 'goal');

		actor = game.add.sprite(100, 245, 'actor');

		ground = game.add.tileSprite(0, 550, 20000, 60, 'ground');

		// change sound status(pause music function)
		if (soundStatus == 0) {
			soundButton = this.game.add.button(742, 10, 'sound', 0, 1, 0, 0, 1);
		} else if (soundStatus == 1) {
			soundButton = this.game.add.button(742, 10, 'sound', 0, 1, 1, 1, 0);
		}
		soundButton.inputEnabled = true;
		soundButton.events.onInputUp.add(function() {
			if (soundStatus == 0) {
				soundButton.setFrames(1, 1, 0, 1);
				soundStatus = 1;
				backgroundMusic.pause();
			} else if (soundStatus == 1) {
				soundButton.setFrames(0, 0, 1, 0);
				soundStatus = 0;
				backgroundMusic.resume();
			}
		}, this);
		soundButton.fixedToCamera = true;

		// add pause game function
		pauseButton = this.game.add.button(684, 10, 'pause', 0, 1, 1, 1, 0);
		pauseButton.inputEnabled = true;
		pauseButton.events.onInputUp.add(function() {
			pauseButton.setFrames(0, 0, 1, 0);
			if (actor.x < 400) {
				pauseText = game.add.text(50, 240,
						"Click anywhere to continue the game.", {
							font : "40px Comic Sans MS",
							fill : "#ffffff",
							align : "center",
						});
			} else {
				pauseText = game.add.text(actor.x - 350, 240,
						"Click anywhere to continue the game.", {
							font : "40px Comic Sans MS",
							fill : "#ffffff",
							align : "center",
						});
			}
			this.game.paused = true;
		}, this);
		game.input.onDown.add(function() {
			if (this.game.paused) {
				this.game.paused = false;
				pauseText.destroy();
				pauseButton.setFrames(1, 1, 0, 1);
			}
		}, this);
		pauseButton.fixedToCamera = true;

		// add restart function
		restartButton = this.game.add.button(626, 10, 'restart', function() {
			score = 0;
			game.state.start("Main");
		});
		restartButton.fixedToCamera = true;

		// create blocks and enemy fishes
		fishHooks = game.add.group();
		grasses = game.add.group();
		fishes0 = game.add.group();
		fishes1 = game.add.group();
		fishes2 = game.add.group();
		fishes3 = game.add.group();

		//generate the blocks
		this.generateFishHook();
		this.generateGrass();
		this.generateFish0();
		this.generateFish1();
		this.generateFish2();
		this.generateFish3();

		// ensure that there is no overlap of any enemy fishes
		game.physics.arcade.overlap(fishes0, fishes0, this.checkOverlap, null,
				this);
		game.physics.arcade.overlap(fishes1, fishes1, this.checkOverlap, null,
				this);
		game.physics.arcade.overlap(fishes2, fishes2, this.checkOverlap, null,
				this);
		game.physics.arcade.overlap(fishes3, fishes3, this.checkOverlap, null,
				this);
		game.physics.arcade.overlap(fishes0, fishes1, this.checkOverlap, null,
				this);
		game.physics.arcade.overlap(fishes0, fishes2, this.checkOverlap, null,
				this);
		game.physics.arcade.overlap(fishes0, fishes3, this.checkOverlap, null,
				this);
		game.physics.arcade.overlap(fishes1, fishes2, this.checkOverlap, null,
				this);
		game.physics.arcade.overlap(fishes1, fishes3, this.checkOverlap, null,
				this);
		game.physics.arcade.overlap(fishes2, fishes3, this.checkOverlap, null,
				this);

		// make the main actor swim
		actor.animations.add('swim');
		actor.animations.play('swim', 10, true);

		//enable the physics engine
		game.physics.arcade.enable(actor);
		game.physics.arcade.enable(goal);

		//set actor velocity
		actor.body.velocity.x = 400;

		
		//set camera to follow
		game.camera.follow(actor);

		// set the score which is fixed to the camera
		scoreText = game.add.text(600, 550, "score: " + score, {
			font : "32px Comic Sans MS",
			fill : "#ffffff",
			align : "center"
		});
		scoreText.fixedToCamera = true;
		scoreText.cameraOffset.setTo(600, 550);
		if (difficulty < 3) {
			progressText = game.add.text(320, 550, "level: " + (difficulty + 1)
					+ "/3", {
				font : "32px Comic Sans MS",
				fill : "#ffffff",
				align : "center"
			});
			progressText.fixedToCamera = true;
			progressText.cameraOffset.setTo(320, 550);
		} else {
			progressText = game.add.text(320, 550, "level: reward", {
				font : "32px Comic Sans MS",
				fill : "#ffffff",
				align : "center"
			});
			progressText.fixedToCamera = true;
			progressText.cameraOffset.setTo(320, 550);
		}

		// set the hints which is fixed to the camera for helping users
		informationText = game.add.text(10, 10, "safe with: ", {
			font : "32px Comic Sans MS",
			fill : "#ffffff",
			align : "center"
		});
		informationText.fixedToCamera = true;
		informationText.cameraOffset.setTo(10, 10);

		infoPic1 = game.add.sprite(10, 80, "fish0");
		infoSprites.add(infoPic1);
		infoPic1.fixedToCamera = true;
		infoPic1.cameraOffset.setTo(10, 80);

		infoPic2 = game.add.sprite(45, 80, "fish1");
		infoPic2.fixedToCamera = true;
		infoPic2.cameraOffset.setTo(45, 80);
		infoSprites.add(infoPic2);

		infoPic3 = game.add.sprite(115, 80, "fish2");
		infoSprites.add(infoPic3);
		infoPic3.fixedToCamera = true;
		infoPic3.cameraOffset.setTo(115, 80);

		infoPic4 = game.add.sprite(207, 80, "fish3");
		infoPic4.cameraOffset.setTo(207, 80);
		infoSprites.add(infoPic4);
		infoPic4.fixedToCamera = true;

		// change the hints according to the current main actor's situation
		this.generateHints(2);

	},

	update : function() {

		//if goal in not alive, set it to be alive
		if (goal.alive == false) {
			goal.revive();
		}
		
		// give actor a gravity
		actor.body.gravity.y = 700;

		// give the actor an upward velocity when pressing space
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			actor.body.velocity.y = -200;
			if (soundStatus == 0) {
				this.jumpSound.play();
			} else if (soundStatus == 1) {
				this.jumpSound.pause();
			}
		}

		// check if the main actor hits something
		game.physics.arcade.overlap(actor, grasses, this.hitBlock, null, this);
		game.physics.arcade
				.overlap(actor, fishHooks, this.hitBlock, null, this);
		game.physics.arcade.overlap(actor, fishes0, this.fishCollision0, null,
				this);
		game.physics.arcade.overlap(actor, fishes1, this.fishCollision1, null,
				this);
		game.physics.arcade.overlap(actor, fishes2, this.fishCollision2, null,
				this);
		game.physics.arcade.overlap(actor, fishes3, this.fishCollision3, null,
				this);

		game.physics.arcade.overlap(actor, goal, this.nextRound, null, this);

		// make sure the actor would not swim out of the world
		if (actor.y < 0) {
			actor.y = 0;
		}
		
		//make sure the actor(in different size) would not swim out of the world
		if (level == 2) {
			if (actor.y > 470) {
				actor.body.gravity.y = 0;
				actor.y = 470;
			}
		} else if (level == 3) {
			if (actor.y > 450) {
				actor.body.gravity.y = 0;
				actor.y = 450;
			}
		} else if (level == 1) {
			if (actor.y > 490) {
				actor.body.gravity.y = 0;
				actor.y = 490;
			}
		}

		// calculate the score
		score = Math.ceil(score + 0.008);
		scoreText.text = "score:" + score;
	},

	nextRound : function() {
		// avoid the goal to be hit several times
		goal.kill();
		
		//set difficulty
		difficulty = difficulty + 1;

		if (difficulty == 3) {// reward stage
			level = 2;
			game.state.start('Reward');
		} else if (difficulty < 3) {// level up
			this.result2();
			level = 2;
		}

	},

	// create the fish hooks in random x axis and in random height
	generateFishHook : function() {
		var temp = 0;

		if (difficulty == 0) {
			temp = 20;
		} else if (difficulty == 1) {
			temp = 5;
		} else {
			temp = 10;
		}

		if (difficulty == 0) {// when difficulty is 0
			for (var i = 0; i < 50; i++) {
				var topPosition = 0 - Math.random() * 150;
				var xPosition = Math.random() * 16000 + 2000;
				var block = game.add.sprite(Math.ceil(xPosition), Math
						.ceil(topPosition), 'fishHook');
				fishHooks.add(block);
				game.physics.arcade.enable(block);

			}
		} else {//when difficulty is not 0
			for (var i = 0; i < temp; i++) {
				var topPosition = 0 - Math.random() * 150;
				var xPosition = Math.random() * 2000 + 2000;
				var block = game.add.sprite(Math.ceil(xPosition), Math
						.ceil(topPosition), 'fishHook');
				fishHooks.add(block);
				game.physics.arcade.enable(block);

			}

			for (var i = 0; i < 20; i++) {
				var topPosition = 0 - Math.random() * 150;
				var xPosition = Math.random() * 14000 + 4000;
				var block = game.add.sprite(Math.ceil(xPosition), Math
						.ceil(topPosition), 'fishHook');
				fishHooks.add(block);
				game.physics.arcade.enable(block);

			}
		}
	},

	// generate grass in random x axis and in random height
	generateGrass : function() {
		var temp = 0;

		if (difficulty == 0) {
			temp = 20;
		} else if (difficulty == 1) {
			temp = 5;
		} else {
			temp = 10;
		}

		if (difficulty == 0) {
			for (var i = 0; i < 50; i++) {
				var bottomPosition = 440 - Math.random() * 50;
				var xPosition = Math.random() * 16000 + 2000;
				var block = game.add.sprite(Math.ceil(xPosition), Math
						.ceil(bottomPosition), 'grass');
				grasses.add(block);
				game.physics.arcade.enable(block);
			}
		} else {
			for (var i = 0; i < temp; i++) {
				var bottomPosition = 440 - Math.random() * 50;
				var xPosition = Math.random() * 2000 + 2000;
				var block = game.add.sprite(Math.ceil(xPosition), Math
						.ceil(bottomPosition), 'grass');
				grasses.add(block);
				game.physics.arcade.enable(block);

			}

			for (var i = 0; i < 20; i++) {
				var bottomPosition = 440 - Math.random() * 50;
				var xPosition = Math.random() * 14000 + 4000;
				var block = game.add.sprite(Math.ceil(xPosition), Math
						.ceil(bottomPosition), 'grass');
				grasses.add(block);
				game.physics.arcade.enable(block);

			}
		}
	},

	// generate fish 0 randomly
	generateFish0 : function() {

		// use 180px here to avoid the overlap between the fish0 and fish hooks
		for (var i = 0; i < 15; i++) {
			var fish0 = game.add.sprite(Math
					.ceil((Math.random() * 16000 + 4000)), 180 + Math.ceil(Math
					.random() * 300), 'fish0');
			fishes0.add(fish0);
			game.physics.arcade.enable(fish0);

		}

		// make the fish0 to swim(move)
		game.add.tween(fishes0).to({
			y : 50
		}, 1000, null, true, 0, Number.MAX_VALUE, true);

	},
	// generate fish 1 randomly and make them swim
	generateFish1 : function() {
		var temp = 0;
		if (difficulty == 0) {
			temp = 0;
		} else if (difficulty == 1) {
			temp = 10;
		} else if (difficulty == 2) {
			temp = 20;
		}

		for (var i = 0; i < temp; i++) {
			var fish1 = game.add.sprite(Math
					.ceil((Math.random() * 16000 + 4000)), 180 + Math.ceil(Math
					.random() * 300), 'fish1');
			fishes1.add(fish1);
			game.physics.arcade.enable(fish1);

		}
		// make the fish1 to swim(move)
		game.add.tween(fishes1).to({
			y : 30
		}, 1000, null, true, 0, Number.MAX_VALUE, true);

	},

	// generate fish2 randomly and make them swim
	generateFish2 : function() {

		var temp = 0;
		if (difficulty == 0) {
			temp = 0;
		} else if (difficulty == 1) {
			temp = 5;
		} else if (difficulty == 2) {
			temp = 15;
		}

		for (var i = 0; i < temp; i++) {
			var fish2 = game.add.sprite(Math
					.ceil((Math.random() * 16000 + 4000)), 180 + Math.ceil(Math
					.random() * 300), 'fish2');
			fishes2.add(fish2);
			game.physics.arcade.enable(fish2);

		}

		game.add.tween(fishes2).to({
			y : 30
		}, 1000, null, true, 0, Number.MAX_VALUE, true);

	},
	// generate fish3 randomly and make them swim
	generateFish3 : function() {
		var temp = 0;
		if (difficulty == 0) {
			temp = 0;
		} else if (difficulty == 1) {
			temp = 5;
		} else if (difficulty == 2) {
			temp = 10;
		}
		for (var i = 0; i < temp; i++) {
			var fish3 = game.add.sprite(Math
					.ceil((Math.random() * 16000 + 4000)), 180 + Math.ceil(Math
					.random() * 300), 'fish3');
			fishes3.add(fish3);
			game.physics.arcade.enable(fish3);

		}

		game.add.tween(fishes3).to({
			y : 30
		}, 1000, null, true, 0, Number.MAX_VALUE, true);
	},

	// if the main actor hit the blocks(fish hooks and grasses), it dies
	hitBlock : function() {
		if (soundStatus == 0) {
			this.screamSound.play();
		} else if (soundStatus == 1) {
			this.screamSound.pause();
		}
		this.result1();

	},
	// hide the overlapping fish(when generating the enemy fishes)
	checkOverlap : function(fishG1, fishG2) {

		fishG1.kill();

	},
	// the action if the main actor hits fish0
	fishCollision0 : function(actor, fish0) {

		if (soundStatus == 0) {
			this.eatSound.play();
		} else if (soundStatus == 1) {
			this.eatSound.pause();
		}
		score = Math.ceil(score + 20);
		scoreText.text = "score:" + score;
		if (level == 1) {
			fish0.kill();
			game.add.tween(actor.scale).to({
				x : 1,
				y : 1
			}, 100, Phaser.Easing.Linear.None, true);
			level = 2;
			this.generateHints(2);
		} else if (level == 2) {
			fish0.kill();
		} else if (level == 3) {
			fish0.kill();
		}

	},
	//the action when the main actor hits fish1
	fishCollision1 : function(actor, fish1) {

		if (level == 2) {// level 2: then grow up and add more score 
			game.add.tween(actor.scale).to({
				x : 1.3,
				y : 1.3
			}, 100, Phaser.Easing.Linear.None, true);
			
			if (soundStatus == 0) {
				this.eatSound.play();
			} else if (soundStatus == 1) {
				this.eatSound.pause();
			}
			
			score = Math.ceil(score + 40);
			scoreText.text = "score:" + score;
			deadX = fish1.x;
			deadY = fish1.y;
			var dead1 = game.add.sprite(deadX, deadY, 'dead1');
			game.physics.enable(dead1, Phaser.Physics.ARCADE);
			dead1.body.velocity.y = -50;

			fish1.kill();
			level = 3;
			this.generateHints(3);

		} else if (level == 3) {// level 3: add more score
			
			if (soundStatus == 0) {
				this.eatSound.play();
			} else if (soundStatus == 1) {
				this.eatSound.pause();
			}
			
			score = Math.ceil(score + 40);
			scoreText.text = "score:" + score;
			deadX = fish1.x;
			deadY = fish1.y;
			var dead1 = game.add.sprite(deadX, deadY, 'dead1');
			game.physics.enable(dead1, Phaser.Physics.ARCADE);
			dead1.body.velocity.y = -50;

			fish1.kill();
		} else if (level == 1) {//level 1: no action
			deadX = fish1.x;
			deadY = fish1.y;
			var dead1 = game.add.sprite(deadX, deadY, 'dead1');
			game.physics.enable(dead1, Phaser.Physics.ARCADE);
			dead1.body.velocity.y = -50;

			fish1.kill();
		}

	},
	//the action when the main actor hits fish2
	fishCollision2 : function(actor, fish2) {

		if (level == 3) {//level 3: plus score
			if (soundStatus == 0) {
				this.eatSound.play();
			} else if (soundStatus == 1) {
				this.eatSound.pause();
			}
			score = Math.ceil(score + 40);
			scoreText.text = "score:" + score;
			fish2.kill();

			deadX = fish2.x;
			deadY = fish2.y;
			var dead2 = game.add.sprite(deadX, deadY, 'dead2');
			game.physics.enable(dead2, Phaser.Physics.ARCADE);
			dead2.body.velocity.y = -50;

		} else if (level == 1) {//level 1: die
			if (soundStatus == 0) {
				this.screamSound.play();
			} else if (soundStatus == 1) {
				this.screamSound.pause();
			}
			this.result1();
		} else if (level == 2) {//level 2: become smaller
			game.add.tween(actor.scale).to({
				x : 0.8,
				y : 0.8
			}, 100, Phaser.Easing.Linear.None, true);

			deadX = fish2.x;
			deadY = fish2.y;
			var dead2 = game.add.sprite(deadX, deadY, 'dead2');
			game.physics.enable(dead2, Phaser.Physics.ARCADE);
			dead2.body.velocity.y = -50;

			fish2.kill();

			level = 1;
			this.generateHints(1);

		}

	},
	//the action when the main actor hits fish3,
	fishCollision3 : function(actor, fish3) {

		if (level == 3) {//level 3: become smaller
			game.add.tween(actor.scale).to({
				x : 1,
				y : 1
			}, 100, Phaser.Easing.Linear.None, true);

			deadX = fish3.x;
			deadY = fish3.y;
			var dead3 = game.add.sprite(deadX, deadY, 'dead3');
			game.physics.enable(dead3, Phaser.Physics.ARCADE);
			dead3.body.velocity.y = -50;

			fish3.kill();
			level = 2;
			this.generateHints(2);
		} else if (level == 2) {//level 2: die
			if (soundStatus == 0) {
				this.screamSound.play();
			} else if (soundStatus == 1) {
				this.screamSound.pause();
			}
			this.result1();
		} else if (level == 1) {//level 1: die
			if (soundStatus == 0) {
				this.screamSound.play();
			} else if (soundStatus == 1) {
				this.screamSound.pause();
			}
			this.result1();
		}

	},

	// show the game result
	result1 : function() {
		level = 2;
		game.state.start('Result1');

	},

	// show the game result when achieve one round
	result2 : function() {
		level = 2;
		game.state.start('Result2');

	},

	// generate the hints which is fixed to the camera
	generateHints : function(level) {
		if (difficulty < 3) {
			if (level == 1) {
				if (infoPic3.alive == true) {
					infoPic3.kill();
				}
				if (infoPic4.alive == true) {
					infoPic4.kill();
				}
			} else if (level == 2) {
				if (infoPic2.alive == false) {
					infoPic2.revive();
				}
				if (infoPic3.alive == false) {
					infoPic3.revive();
				}
				if (infoPic4.alive == true) {
					infoPic4.kill();
				}
			} else if (level == 3) {

				if (infoPic2.alive == false) {
					infoPic2.revive();
				}
				if (infoPic3.alive == false) {
					infoPic3.revive();
				}
				if (infoPic4.alive == false) {
					infoPic4.revive();
				}
			}
		} else {
			if (infoPic2.alive == true) {
				infoPic2.kill();
			}
			if (infoPic3.alive == true) {
				infoPic3.kill();
			}
			if (infoPic4.alive == true) {
				infoPic4.kill();
			}
			if (infoPic1.alive == true) {
				infoPic1.kill();
			}
		}

	},

	render : function() {
		// game.debug.cameraInfo(game.camera, 32, 120);
		// game.debug.spriteInfo(actor, 32, 32);
	}

};


//menu state of the game
var MenuState = {
	preload : function() {

		game.world.setBounds(0, 0, 5000, 500);
		game.stage.backgroundColor = '#58a7e8';

		//load images
		game.load.image('logo2', 'assets/menu images/logo2.png');
		game.load.image('logo', 'assets/menu images/logo.png');
		game.load.image('helpBtn', 'assets/menu images/help.png');
		game.load.image('easy', 'assets/menu images/easy.png');
		game.load.image('hard', 'assets/menu images/hard.png');
		game.load.image('normal', 'assets/menu images/normal.png');
		game.load.image('info', 'assets/menu images/info.png');

		game.load.spritesheet('sound', 'assets/function images/sound.png', 48,
				48, 2);
		game.load.spritesheet('actor', 'assets/main images/actor.png', 107, 80,
				2);

		//load sounds
		game.load.audio('background', 'assets/music/background_start.mp3');

	},
	create : function() {
		var logo = game.add.image(0, 0, 'logo');
		logo.reset((game.width - logo.width) / 2,
				(game.height - logo.height) / 2 - 150);

		// change sound status
		if (soundStatus == 0) {
			soundButton = this.game.add.button(742, 10, 'sound', 0, 1, 0, 0, 1);
		} else if (soundStatus == 1) {
			soundButton = this.game.add.button(742, 10, 'sound', 0, 1, 1, 1, 0);
		}

		// the background music loops
		if (onmusic == 0) {
			backgroundMusic = game.add.audio('background', 0.2, true);
			backgroundMusic.play();
			onmusic = 1;
		}

		//define sound button
		soundButton.inputEnabled = true;
		soundButton.events.onInputUp.add(function() {
			if (soundStatus == 0) {
				soundButton.setFrames(1, 1, 0, 1);
				soundStatus = 1;
				backgroundMusic.pause();
			} else if (soundStatus == 1) {
				soundButton.setFrames(0, 0, 1, 0);
				soundStatus = 0;
				backgroundMusic.resume();
			}
		}, this);
		soundButton.fixedToCamera = true;

		// click on the help button
		var helpBtn = game.add.sprite(0, 0, 'helpBtn');
		helpBtn.reset((game.width - helpBtn.width) / 2 - 100,
				(game.height - helpBtn.height) / 2 + 200);
		helpBtn.inputEnabled = true;
		helpBtn.events.onInputDown.add(this.helpGame);

		// click on the information button
		var infoBtn = game.add.sprite(0, 0, 'info');
		infoBtn.reset((game.width - infoBtn.width) / 2 + 100,
				(game.height - infoBtn.height) / 2 + 200);
		infoBtn.inputEnabled = true;
		infoBtn.events.onInputDown.add(this.showInfo);

		// add the swimming fish to the logo
		var actor = game.add.sprite(0, 0, 'actor');
		actor.reset((game.width - actor.width) / 2 - 100,
				(game.height - actor.height) / 2 - 80);
		actor.animations.add('swim');
		actor.animations.play('swim', 10, true);
		game.physics.arcade.enable(actor);

		// add different game levels
		var normal = game.add.sprite(0, 0, 'normal');
		normal.reset((game.width - normal.width) / 2,
				(game.height - normal.height) / 2 + 80);
		normal.inputEnabled = true;
		normal.events.onInputDown.add(this.startNormal);

		var easy = game.add.sprite(0, 0, 'easy');
		easy.reset((game.width - easy.width) / 2 - 200,
				(game.height - easy.height) / 2 + 80);
		easy.inputEnabled = true;
		easy.events.onInputDown.add(this.startEasy);

		var hard = game.add.sprite(0, 0, 'hard');
		hard.reset((game.width - hard.width) / 2 + 200,
				(game.height - hard.height) / 2 + 80);
		hard.inputEnabled = true;
		hard.events.onInputDown.add(this.startHard);

		// var space_key = this.game.input.keyboard
		// .addKey(Phaser.Keyboard.SPACEBAR);
		// space_key.onDown.add(this.start, this);
	},

	//go to information state
	showInfo : function() {
		game.state.start("Info");
	},

	//go to help state
	helpGame : function() {
		// help information
		game.state.start('Help1');
	},

	//start game easy mode
	startEasy : function() {
		difficulty = 0;
		this.game.state.start('Main');

	},

	//start game normal mode
	startNormal : function() {
		difficulty = 1;
		this.game.state.start('Main');

	},

	//start game hard mode
	startHard : function() {
		difficulty = 2;
		this.game.state.start('Main');

	},
};

//result state which user does not hit the flag(die on the half way)
var ResultState1 = {
	preload : function() {

		game.stage.backgroundColor = '#58a7e8';

		game.load.image('again', 'assets/result images/again.png');
		game.load.image('back', 'assets/result images/back.png');
		game.load.spritesheet('actor', 'assets/main images/actor.png', 107, 80,
				2);

	},
	create : function() {

		// add score result
		if (difficulty == 0) {
			game.add.text(250, 100, "Good job!", {
				font : "64px Comic Sans MS",
				fill : "#ffffff",
				align : "center",
			});

		} else if (difficulty == 1) {
			game.add.text(270, 100, "Great!", {
				font : "64px Comic Sans MS",
				fill : "#ffffff",
				align : "center",
			});

		} else if (difficulty == 2) {
			game.add.text(250, 100, "Excellent!", {
				font : "64px Comic Sans MS",
				fill : "#ffffff",
				align : "center",
			});

		} else if (difficulty > 2) {
			game.add.text(70, 100, "You cleared! Unbelievable!", {
				font : "55px Comic Sans MS",
				fill : "#ffffff",
				align : "center",
			});

		}

		if (difficulty > 2) {
			difficulty = 2;
		}

		//add score text
		game.add.text(250, 200, "score: " + score, {
			font : "64px Comic Sans MS",
			fill : "#ffffff",
			align : "center",
		});

		// add buttons
		var again = game.add.sprite(150, 400, 'again');
		again.inputEnabled = true;
		again.events.onInputDown.add(this.again);

		var back = game.add.sprite(525, 400, 'back');
		back.inputEnabled = true;
		back.events.onInputDown.add(this.back);

		var actor = game.add.sprite(130, 200, 'actor');
		actor.animations.add('swim');
		actor.animations.play('swim', 10, true);

	},

	//start game again
	again : function() {
		score = 0;
		game.state.start("Main");

	},
	
	//back to menu
	back : function() {
		score = 0;
		game.state.start("Menu");

	},

};

//result state which user hits the flag
var ResultState2 = {
	preload : function() {

		game.stage.backgroundColor = '#58a7e8';

		game.load.image('again', 'assets/result images/again.png');
		game.load.image('back', 'assets/result images/back.png');
		game.load.image('nextLevel', 'assets/result images/nextLevel.png');
		game.load.spritesheet('actor', 'assets/main images/actor.png', 107, 80,
				2);

	},
	create : function() {

		// add score result
		if (difficulty == 0) {
			game.add.text(250, 100, "Good job!", {
				font : "64px Comic Sans MS",
				fill : "#ffffff",
				align : "center",
			});

		} else if (difficulty == 1) {
			game.add.text(270, 100, "Great!", {
				font : "64px Comic Sans MS",
				fill : "#ffffff",
				align : "center",
			});

		} else if (difficulty == 2) {
			game.add.text(250, 100, "Excellent!", {
				font : "64px Comic Sans MS",
				fill : "#ffffff",
				align : "center",
			});

		} else if (difficulty > 2) {
			game.add.text(70, 100, "You cleared! Unbelievable!", {
				font : "55px Comic Sans MS",
				fill : "#ffffff",
				align : "center",
			});

		}

		if (difficulty > 2) {
			difficulty = 2;
		}

		//add socre text
		game.add.text(250, 200, "score: " + score, {
			font : "64px Comic Sans MS",
			fill : "#ffffff",
			align : "center",
		});

		// add buttons
		var again = game.add.sprite(106, 400, 'again');
		again.inputEnabled = true;
		again.events.onInputDown.add(this.again);

		var nextLevel = game.add.sprite(338, 400, 'nextLevel');
		nextLevel.inputEnabled = true;
		nextLevel.events.onInputDown.add(this.nextLevel);

		var back = game.add.sprite(570, 400, 'back');
		back.inputEnabled = true;
		back.events.onInputDown.add(this.back);

		var actor = game.add.sprite(130, 200, 'actor');
		actor.animations.add('swim');
		actor.animations.play('swim', 10, true);

	},
	
	//start game again with the same difficulty
	again : function() {
		score = 0;
		difficulty = difficulty - 1;
		game.state.start("Main");

	},

	//go to next level
	nextLevel : function() {
		score = 0;
		game.state.start('Main');
	},

	//go to menu
	back : function() {
		score = 0;
		game.state.start("Menu");

	},

};

//information state(references, group members' name)
var InformationState = {
	preload : function() {
		game.stage.backgroundColor = '#58a7e8';
		game.load.image('reference', 'assets/menu images/reference.png');
		game.load.image('fish[0]', 'assets/main images/fish0.png');
		game.load.image('fish[1]', 'assets/main images/fish1.png');
		game.load.image('back', 'assets/result images/back.png');
	},
	create : function() {

		game.add.sprite(10, 40, 'reference');

		//add fishes for decoration
		for (var i = 20; i < 500; i = i + 150) {
			game.add.sprite(i, 500, 'fish[0]');
			game.add.sprite(i + 50, 500, 'fish[1]');
		}

		//back button
		var back = game.add.sprite(625, 480, 'back');
		back.inputEnabled = true;
		back.events.onInputDown.add(this.back);

	},
	//back to menu
	back : function() {
		game.state.start('Menu');
	}

};

//reward state (if user passes the difficulty level, here is a bonus state)
var actorRe;
var RewardState = {

	preload : function() {
		game.stage.backgroundColor = '#58a7e8';

		//load images
		game.load.image('ground', 'assets/main images/ground.png');

		game.load.spritesheet('pause', 'assets/function images/pause.png', 48,
				48);
		game.load.spritesheet('sound', 'assets/function images/sound.png', 48,
				48, 2);
		game.load.spritesheet('actor', 'assets/main images/actor.png', 107,
				80, 2);

		game.load.image('fish0', 'assets/main images/fish0.png');
		game.load.image('coin', 'assets/main images/coin.png');
		game.load.image('goal', 'assets/main images/flag.png');

		//load musics
		game.load.audio('jump', 'assets/music/waterReentry.wav');
		game.load.audio('eat', 'assets/music/eating.wav');
	},

	create : function() {

		game.world.setBounds(0, 0, 10000, 550);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// add sounds
		this.jumpSound = game.add.audio('jump');
		this.jumpSound.volume = 0.2;

		this.eatSound = game.add.audio('eat');
		this.eatSound.volume = 0.2;

		// change sound status
		if (soundStatus == 0) {
			soundButton = this.game.add.button(742, 10, 'sound', 0, 1, 0, 0, 1);
		} else if (soundStatus == 1) {
			soundButton = this.game.add.button(742, 10, 'sound', 0, 1, 1, 1, 0);
		}
		soundButton.inputEnabled = true;
		soundButton.events.onInputUp.add(function() {
			if (soundStatus == 0) {
				soundButton.setFrames(1, 1, 0, 1);
				soundStatus = 1;
				backgroundMusic.pause();
			} else if (soundStatus == 1) {
				soundButton.setFrames(0, 0, 1, 0);
				soundStatus = 0;
				backgroundMusic.resume();
			}
		}, this);
		soundButton.fixedToCamera = true;

		// add pause game function
		pauseButton = this.game.add.button(684, 10, 'pause', 0, 1, 1, 1, 0);
		pauseButton.inputEnabled = true;
		pauseButton.events.onInputUp.add(function() {
			pauseButton.setFrames(0, 0, 1, 0);
			if (actorRe.x < 400) {
				pauseText = game.add.text(50, 240,
						"Click anywhere to continue the game.", {
							font : "40px Comic Sans MS",
							fill : "#ffffff",
							align : "center",
						});
			} else {
				pauseText = game.add.text(actorRe.x - 350, 240,
						"Click anywhere to continue the game.", {
							font : "40px Comic Sans MS",
							fill : "#ffffff",
							align : "center",
						});
			}
			this.game.paused = true;
		}, this);
		game.input.onDown.add(function() {
			if (this.game.paused) {
				this.game.paused = false;
				pauseText.destroy();
				pauseButton.setFrames(1, 1, 0, 1);
			}
		}, this);
		pauseButton.fixedToCamera = true;

		// create actors and actor groups
		actorRe = game.add.sprite(100, 245, 'actor');

		ground = game.add.tileSprite(0, 550, 20000, 60, 'ground');
		goal = game.add.sprite(9800, 20, 'goal');

		// create blocks and enemy fishes
		coins = game.add.group();
		fishes0 = game.add.group();

		this.generateCoin();
		this.generateFish0();

		// make the main actor swim

		actorRe.animations.add('swim');
		actorRe.animations.play('swim', 10, true);
		game.physics.arcade.enable(actorRe);

		game.physics.arcade.enable(goal);

		actorRe.body.velocity.x = 400;

		//add score text
		scoreText = game.add.text(600, 550, "score: " + score, {
			font : "32px Comic Sans MS",
			fill : "#ffffff",
			align : "center"
		});
		scoreText.fixedToCamera = true;
		scoreText.cameraOffset.setTo(600, 550);

		//add progress text
		progressText = game.add.text(320, 550, "level: reward", {
			font : "32px Comic Sans MS",
			fill : "#ffffff",
			align : "center"
		});
		progressText.fixedToCamera = true;
		progressText.cameraOffset.setTo(320, 550);

		//add information text
		informationText = game.add.text(10, 10, "eat coins and small fishes! ",
				{
					font : "32px Comic Sans MS",
					fill : "#ffffff",
					align : "center"
				});
		informationText.fixedToCamera = true;
		informationText.cameraOffset.setTo(10, 10);
		
		//set camera follow
		game.camera.follow(actorRe);

	},

	update : function() {

		// give actor a gravity
		actorRe.body.gravity.y = 700;

		// give the actor an upward velocity
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			actorRe.body.velocity.y = -200;
			if (soundStatus == 0) {
				this.jumpSound.play();
			} else if (soundStatus == 1) {
				this.jumpSound.pause();
			}
		}

		// check if the main actor hits something
		game.physics.arcade.overlap(actorRe, coins, this.eatCoins, null, this);
		game.physics.arcade.overlap(actorRe, fishes0, this.fishCollision0,
				null, this);
		game.physics.arcade.overlap(actorRe, goal, this.result, null, this);

		// make sure the actor would not swim out of the world
		if (actorRe.y < 0) {
			actorRe.y = 0;
		}
		if (actorRe.y > 470) {
			actorRe.body.gravity.y = 0;
			actorRe.y = 470;
		}

	},

	//go to result state
	result : function() {
		// alert("win");
		level = 2;
		difficulty = 3;
		game.state.start('Result1');
	},

	// create the coin in curves
	generateCoin : function() {
		for (var i = 0; i < 16; i++) {
			var coin = coins.create(25 * i + 100, 275, 'coin');
			coins.add(coin);
		}

		for (var i = 0; i < 28; i++) {
			var x = new Array(25 * i + 4350, 25 * i + 8550, 25 * i + 9600);
			for (var j = 0; j < 3; j++) {
				var coin = coins.create(x[j], 275, 'coin');
				var coin = coins.create(x[j], 300, 'coin');
				var coin = coins.create(x[j], 250, 'coin');
			}
			coins.add(coin);
		}

		for (var i = 0; i < 14; i++) {
			var x = new Array(25 * i + 1900, 25 * i + 3300, 25 * i + 4000,
					25 * i + 5050, 25 * i + 9250);
			var y = 4 * i * i - 56 * i + 275;
			for (var j = 0; j < 5; j++) {
				var coin = coins.create(x[j], y, 'coin');
				var coin = coins.create(x[j], y + 25, 'coin');
				var coin = coins.create(x[j], y - 25, 'coin');
			}
			coins.add(coin);
		}

		for (var i = 0; i < 14; i++) {
			var x = new Array(25 * i + 2250, 25 * i + 3650, 25 * i + 4000,
					25 * i + 6800, 25 * i + 9250);
			var y = -4 * i * i + 56 * i + 275;
			for (var j = 0; j < 5; j++) {
				var coin = coins.create(x[j], y, 'coin');
				var coin = coins.create(x[j], y + 25, 'coin');
				var coin = coins.create(x[j], y - 25, 'coin');
			}
			coins.add(coin);
		}

		for (var i = 0; i < 28; i++) {
			var x = new Array(25 * i + 500, 25 * i + 2600, 25 * i + 6100,
					25 * i + 7150);
			var y = i * i - 28 * i + 275;
			for (var j = 0; j < 4; j++) {
				var coin = coins.create(x[j], y, 'coin');
				var coin = coins.create(x[j], y + 25, 'coin');
				var coin = coins.create(x[j], y - 25, 'coin');
			}
			coins.add(coin);
		}

		for (var i = 0; i < 28; i++) {
			var x = new Array(25 * i + 1200, 25 * i + 2600, 25 * i + 5400,
					25 * i + 7850);
			var y = -i * i + 28 * i + 275;
			for (var j = 0; j < 4; j++) {
				var coin = coins.create(x[j], y, 'coin');
				var coin = coins.create(x[j], y + 25, 'coin');
				var coin = coins.create(x[j], y - 25, 'coin');
			}
			coins.add(coin);
		}

		game.physics.arcade.enable(coins);

	},

	// generate fish 0 randomly
	generateFish0 : function() {

		for (var i = 0; i < 30; i++) {
			var fish0 = game.add.sprite(
					Math.ceil((Math.random() * 9500 + 500)), 50 + Math
							.ceil(Math.random() * 400), 'fish0');
			fishes0.add(fish0);
			game.physics.arcade.enable(fish0);

		}

		// make the fish0 to swim(move)
		game.add.tween(fishes0).to({
			y : 50
		}, 2000, null, true, 0, Number.MAX_VALUE, true);

	},

	// when the main actor hits coin, actor will eat coin and gain more points
	eatCoins : function(actor, coin) {
		score = Math.ceil(score + 0.5);
		scoreText.text = "score:" + score;
		coin.kill();
	},

	// if the main actor hits fish0, it will get 20 points
	fishCollision0 : function(actor, fish0) {
		score = Math.ceil(score + 20);
		scoreText.text = "score:" + score;
		if (soundStatus == 0) {
			this.eatSound.play();
		} else if (soundStatus == 1) {
			this.eatSound.pause();
		}
		fish0.kill();

	},

};

//help state page one
var HelpState1 = {
	preload : function() {

		game.world.setBounds(0, 0, 5000, 400);
		game.stage.backgroundColor = '#58a7e8';

		game.load.image('backBtn', 'assets/help images/back.png');
		game.load.image('rightBtn', 'assets/help images/right.png');
		game.load.image('intro1', 'assets/help images/intro1.png');
		game.load.image('number1', 'assets/help images/number1.png');
		game.load.spritesheet('actor', 'assets/main images/actor.png', 107, 80,
				2);

		game.load.audio('jump', 'assets/music/waterReentry.wav');
	},
	create : function() {

		// add buttons
		var backBtn = game.add.sprite(20, 20, 'backBtn');
		backBtn.inputEnabled = true;
		backBtn.events.onInputDown.add(this.backToMenu);

		var rightBtn = game.add.sprite(650, 495, 'rightBtn');
		rightBtn.inputEnabled = true;
		rightBtn.events.onInputDown.add(this.nextPage);

		var number1 = game.add.image(300, 430, 'number1');

		var intro1 = game.add.image(0, 0, 'intro1');
		intro1.reset((game.width - intro1.width) / 2, number1.y - 20);

		// add sounds
		this.jumpSound = game.add.audio('jump');
		this.jumpSound.volume = 0.2;

		// make the main actor swim
		actor = game.add.sprite(340, 245, 'actor');
		actor.animations.add('swim');
		actor.animations.play('swim', 10, true);

		game.physics.arcade.enable(actor);
		actor.body.collideWorldBounds = true;

	},

	update : function() {

		// give actor a gravity
		actor.body.gravity.y = 700;

		// give the actor an upward velocity
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			actor.body.velocity.y = -200;
			if (soundStatus == 0) {
				this.jumpSound.play();
			} else if (soundStatus == 1) {
				this.jumpSound.pause();
			}
		}
	},

	// back to menu
	backToMenu : function() {
		game.state.start('Menu');
	},

	// read next help page
	nextPage : function() {
		this.game.state.start('Help2');
	}

};


//help state page 2
var HelpState2 = {
	preload : function() {

		game.world.setBounds(0, 0, 5000, 500);
		game.stage.backgroundColor = '#58a7e8';

		game.load.image('backBtn', 'assets/help images/back.png');
		game.load.image('leftBtn', 'assets/help images/left.png');
		game.load.image('rightBtn', 'assets/help images/right.png');
		game.load.image('intro2', 'assets/help images/intro2.png');
		game.load.image('number2', 'assets/help images/number2.png');
		game.load.image('helppic2', 'assets/help images/hpic2.png');
	},
	create : function() {

		// add buttons
		var backBtn = game.add.sprite(20, 20, 'backBtn');
		backBtn.inputEnabled = true;
		backBtn.events.onInputDown.add(this.backToMenu);

		var leftBtn = game.add.sprite(120, 495, 'leftBtn');
		leftBtn.inputEnabled = true;
		leftBtn.events.onInputDown.add(this.prePage);

		var rightBtn = game.add.sprite(650, 500, 'rightBtn');
		rightBtn.inputEnabled = true;
		rightBtn.events.onInputDown.add(this.nextPage);

		var number2 = game.add.image(300, 430, 'number2');

		// add help information
		var helppic2 = game.add.image(0, 0, 'helppic2');
		helppic2.reset((game.width - helppic2.width) / 2,
				(game.height - helppic2.height) / 2 - 50);

		var intro2 = game.add.image(0, 0, 'intro2');
		intro2.reset((game.width - intro2.width) / 2, number2.y - 20);
	},

	// back to menu
	backToMenu : function() {
		game.state.start('Menu');
	},

	// read previous help page
	prePage : function() {
		this.game.state.start('Help1');
	},

	// read next help page
	nextPage : function() {
		this.game.state.start('Help3');
	}
};


//help state page 3
var HelpState3 = {
	preload : function() {

		game.world.setBounds(0, 0, 5000, 500);
		game.stage.backgroundColor = '#58a7e8';

		game.load.image('backBtn', 'assets/help images/back.png');
		game.load.image('leftBtn', 'assets/help images/left.png');
		game.load.image('rightBtn', 'assets/help images/right.png');
		game.load.image('intro3', 'assets/help images/intro3.png');
		game.load.image('number3', 'assets/help images/number3.png');
		game.load.image('helppic3', 'assets/help images/hpic3.png');
	},
	create : function() {

		// add buttons
		var backBtn = game.add.sprite(20, 20, 'backBtn');
		backBtn.inputEnabled = true;
		backBtn.events.onInputDown.add(this.backToMenu);

		var leftBtn = game.add.sprite(120, 495, 'leftBtn');
		leftBtn.inputEnabled = true;
		leftBtn.events.onInputDown.add(this.prePage);

		var rightBtn = game.add.sprite(650, 500, 'rightBtn');
		rightBtn.inputEnabled = true;
		rightBtn.events.onInputDown.add(this.nextPage);

		var number3 = game.add.image(300, 430, 'number3');

		// add help information
		var helppic3 = game.add.image(0, 0, 'helppic3');
		helppic3.reset((game.width - helppic3.width) / 2,
				(game.height - helppic3.height) / 2 - 50);

		var intro3 = game.add.image(0, 0, 'intro3');
		intro3.reset((game.width - intro3.width) / 2, number3.y - 20);

	},

	// back to menu
	backToMenu : function() {
		game.state.start('Menu');
	},

	// read previous help page
	prePage : function() {
		this.game.state.start('Help2');
	},

	// read next help page
	nextPage : function() {
		this.game.state.start('Help4');
	}
};


//help state page 4
var HelpState4 = {
	preload : function() {

		game.world.setBounds(0, 0, 5000, 500);
		game.stage.backgroundColor = '#58a7e8';

		game.load.image('backBtn', 'assets/help images/back.png');
		game.load.image('leftBtn', 'assets/help images/left.png');
		game.load.image('intro4', 'assets/help images/intro4.png');
		game.load.image('number4', 'assets/help images/number4.png');
		game.load.image('coin', 'assets/help images/coin.png');
	},
	create : function() {

		// add buttons
		var backBtn = game.add.sprite(20, 20, 'backBtn');
		backBtn.inputEnabled = true;
		backBtn.events.onInputDown.add(this.backToMenu);

		var leftBtn = game.add.sprite(120, 495, 'leftBtn');
		leftBtn.inputEnabled = true;
		leftBtn.events.onInputDown.add(this.prePage);

		var number4 = game.add.image(300, 430, 'number4');

		// add help information
		var coin = game.add.image(0, 0, 'coin');
		coin.reset((game.width - coin.width) / 2,
				(game.height - coin.height) / 2 - 50);

		var intro4 = game.add.image(0, 0, 'intro4');
		intro4.reset((game.width - intro4.width) / 2, number4.y - 20);

	},

	// back to menu
	backToMenu : function() {
		game.state.start('Menu');
	},

	// read previous help page
	prePage : function() {
		this.game.state.start('Help3');
	},

};

// add states
game.state.add('Menu', MenuState);
game.state.add('Help1', HelpState1);
game.state.add('Help2', HelpState2);
game.state.add('Help3', HelpState3);
game.state.add('Help4', HelpState4);
game.state.add('Main', MainState);
game.state.add('Result1', ResultState1);
game.state.add('Result2', ResultState2);
game.state.add('Info', InformationState);
game.state.add('Reward', RewardState);

//start with menu state
game.state.start('Menu');