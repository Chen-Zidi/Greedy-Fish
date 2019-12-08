window.game = new Phaser.Game(800, 600, Phaser.AUTO, "game");

var actorRe;

var fishes0;
var fishes1;
var fishes2;
var fishes3;
var ground;
var fishHooks;
var grasses;
var coins;

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
var difficulty = 0;

var MainState = {

	preload : function() {
//		document.body.style.cursor = "none";
		game.stage.backgroundColor = '#58a7e8';

		game.load.image('fish0', 'assets/images/fish0.png');
		game.load.image('fish1', 'assets/images/fish1.png');
		game.load.image('fish2', 'assets/images/fish2.png');
		game.load.image('fish3', 'assets/images/fish3.png');
		game.load.image('dead1', 'assets/images/dead1.png');
		game.load.image('dead2', 'assets/images/dead2.png');
		game.load.image('dead3', 'assets/images/dead3.png');
		game.load.image('fishHook', 'assets/images/fish_hook.png');
		game.load.image('grass', 'assets/images/grass.png');
		game.load.image('ground', 'assets/images/ground.png');
		game.load.image('goal', 'assets/images/flag.png');
		game.load.image('coin', 'assets/images/coin.png');
		game.load.spritesheet('actor', 'assets/images/actor.png', 99, 80, 2);

		game.load.audio('jump', 'assets/music/waterReentry.wav');
		game.load.audio('eat', 'assets/music/eating.wav');
		game.load.audio('scream', 'assets/music/scream.wav');
		game.load.audio('getCoin', 'assets/music/getCoin.wav');
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

		this.getCoin = game.add.audio('getCoin');
		this.getCoin.volume = 0.2;

		// create actors and actor groups

		infoSprites = game.add.group();

		goal = game.add.sprite(19800, 20, 'goal');

		actorRe = game.add.sprite(100, 245, 'actor');

		ground = game.add.tileSprite(0, 550, 20000, 60, 'ground');

		// create blocks and enemy fishes
		fishHooks = game.add.group();
		grasses = game.add.group();
		fishes0 = game.add.group();
		fishes1 = game.add.group();
		fishes2 = game.add.group();
		fishes3 = game.add.group();
		coins = game.add.group();

		if (difficulty < 3) {
			this.generateFishHook();
			 this.generateGrass();
			this.generateFish0();
			 this.generateFish1();
			 this.generateFish2();
			 this.generateFish3();
		} else {
			this.generateCoin();
		}

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
		actorRe.animations.add('swim');
		actorRe.animations.play('swim', 10, true);

		game.physics.arcade.enable(actorRe);
		game.physics.arcade.enable(goal);

//		if (difficulty < 3) {
//			actor.body.velocity.x = 1000;
//		} else {
			actorRe.body.velocity.x = 400;
//		}

		game.camera.follow(actorRe);

		// write the score which is fixed to the camera
		scoreText = game.add.text(600, 550, "score: " + score, {
			font : "32px Comic Sans MS",
			fill : "#ffffff",
			align : "center"
		});
		scoreText.fixedToCamera = true;
		scoreText.cameraOffset.setTo(600, 550);
		if (difficulty < 3) {
			progressText = game.add.text(320, 550, "level: "
					+ (difficulty + 1) + "/3", {
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

		// write the hints which is fixed to the camera for helping users
		if (difficulty < 3) {
			informationText = game.add.text(10, 10, "safe with: ", {
				font : "32px Comic Sans MS",
				fill : "#ffffff",
				align : "center"
			});
			informationText.fixedToCamera = true;
			informationText.cameraOffset.setTo(10, 10);
		} else {
			informationText = game.add.text(10, 10, "eat coins! ", {
				font : "32px Comic Sans MS",
				fill : "#ffffff",
				align : "center"
			});
			informationText.fixedToCamera = true;
			informationText.cameraOffset.setTo(10, 10);

		}

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

		if (goal.alive == false) {
			goal.revive();
		}
		// give actor a gravity
		actorRe.body.gravity.y = 700;

		// give the actor an upward velocity
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			actorRe.body.velocity.y = -200;
			this.jumpSound.play();
		}

		// check if the main actor hits something
		game.physics.arcade.overlap(actorRe, grasses, this.hitBlock, null, this);
		game.physics.arcade
				.overlap(actorRe, fishHooks, this.hitBlock, null, this);
		game.physics.arcade.overlap(actorRe, fishes0, this.fishCollision0, null,
				this);
		game.physics.arcade.overlap(actorRe, fishes1, this.fishCollision1, null,
				this);
		game.physics.arcade.overlap(actorRe, fishes2, this.fishCollision2, null,
				this);
		game.physics.arcade.overlap(actorRe, fishes3, this.fishCollision3, null,
				this);

		game.physics.arcade.overlap(actorRe, goal, this.nextRound, null, this);
		game.physics.arcade.overlap(actorRe, coins, this.hitCoin, null, this);

		// make sure the actor would not swim out of the world
		if (actorRe.y < 0) {
			actorRe.y = 0;
		}
		if (actorRe.y > 470) {
			actorRe.body.gravity.y = 0;
			actorRe.y = 470;
		}

		// calculate the score
		score = Math.ceil(score + 0.008);
		scoreText.text = "score:" + score;
	},

	hitCoin : function(actor, coin) {
		coin.kill();
		score = Math.ceil(score + 5);
		this.getCoin.play();
		scoreText.text = "score:" + score;

	},

	nextRound : function() {
		goal.kill();
		difficulty = difficulty + 1;
		
		if (difficulty == 3) {//reward stage
			level = 2;
			game.state.start('Rward');
		} else if (difficulty < 3) {//level up
			level = 2;
			game.state.start("Main");
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

		if (difficulty == 0) {
			for (var i = 0; i < 50; i++) {
				var topPosition = 0 - Math.random() * 150;
				var xPosition = Math.random() * 16000 + 2000;
				var block = game.add.sprite(Math.ceil(xPosition), Math
						.ceil(topPosition), 'fishHook');
				fishHooks.add(block);
				game.physics.arcade.enable(block);

			}
		} else {
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

		for (var i = 0; i < 5 * difficulty; i++) {
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
			temp = 5;
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

		this.screamSound.play();
		this.result();

	},
	// hide the overlapping fish(when generating the enemy fishes)
	checkOverlap : function(fishG1, fishG2) {

		fishG1.kill();

	},
	// if the main actor hits fish0, it will get 20 points and grow up(when
	// actor's level is 1)
	fishCollision0 : function(actor, fish0) {

		this.eatSound.play();
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
	// when the main actor hits fish1, it will grow up and gain more points(if
	// it is level 2)
	// or it will gain points(level 3)
	// or it will die(level 1)
	fishCollision1 : function(actor, fish1) {

		if (level == 2) {
			game.add.tween(actor.scale).to({
				x : 1.3,
				y : 1.3
			}, 100, Phaser.Easing.Linear.None, true);
			this.eatSound.play();
			score = Math.ceil( score + 40);
			scoreText.text = "score:" + score;
			deadX = fish1.x;
			deadY = fish1.y;
			var dead1 = game.add.sprite(deadX, deadY, 'dead1');
			game.physics.enable(dead1, Phaser.Physics.ARCADE);
			dead1.body.velocity.y = -50;

			fish1.kill();
			level = 3;
			this.generateHints(3);

		} else if (level == 3) {
			this.eatSound.play();
			score = Math.ceil( score + 40);
			scoreText.text = "score:" +score;
			deadX = fish1.x;
			deadY = fish1.y;
			var dead1 = game.add.sprite(deadX, deadY, 'dead1');
			game.physics.enable(dead1, Phaser.Physics.ARCADE);
			dead1.body.velocity.y = -50;

			fish1.kill();
		} else if (level == 1) {
			this.screamSound.play();
			scoreText.text = "score:" + score;
			this.result();
		}

	},
	// when the main actor hits fish2, it will become smaller(if it is level 2)
	// or it will gain points(level 3)
	// or it will die(level 1)
	fishCollision2 : function(actor, fish2) {

		if (level == 3) {
			this.eatSound.play();
			score = Math.ceil(score + 40);
			scoreText.text = "score:" + score;
			fish2.kill();

			deadX = fish2.x;
			deadY = fish2.y;
			var dead2 = game.add.sprite(deadX, deadY, 'dead2');
			game.physics.enable(dead2, Phaser.Physics.ARCADE);
			dead2.body.velocity.y = -50;

		} else if (level == 1) {
			this.screamSound.play();
			this.result();
		} else if (level == 2) {
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
	// when the main actor hits fish3,
	// or it will become smaller(level 3)
	// or it will die(level 1/2)
	fishCollision3 : function(actor, fish3) {

		if (level == 3) {
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
		} else if (level == 2) {
			this.screamSound.play();
			this.result();
		} else if (level == 1) {
			this.screamSound.play();
			this.result();
		}

	},

	// restart the game
	result : function() {
		level = 2;
		game.state.start('Result');
		
	},

	// generate the hints which is fixed to the camera
	generateHints : function(level) {
		if (difficulty < 3) {
			if (level == 1) {
				if (infoPic2.alive == true) {
					infoPic2.kill();
				}
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
		game.debug.spriteInfo(actorRe, 32, 32);
	}

};


var MenuState = {
	preload : function() {

		game.world.setBounds(0, 0, 5000, 500);
		game.stage.backgroundColor = '#58a7e8';

		game.load.image('logo2', 'assets/Menu images/logo2.png');
		game.load.image('logo', 'assets/Menu images/logo.png');
		game.load.image('helpBtn', 'assets/Menu images/help.png');
		game.load.image('easy', 'assets/Menu images/easy.png');
		game.load.image('hard', 'assets/Menu images/hard.png');
		game.load.image('normal', 'assets/Menu images/normal.png');
		game.load.image('info', 'assets/Menu images/info.png');
		
		game.load.spritesheet('actor', 'assets/images/actor.png', 99, 80, 2);
		
		game.load.audio('background', 'assets/music/background_start.wav');
		

	},
	create : function() {
		var logo = game.add.image(0, 0, 'logo');
		logo.reset((game.width - logo.width) / 2,
				(game.height - logo .height) / 2 - 150);


		var menuText = game.add.text(260, 300 , "press space to jump", {
			font : "32px Comic Sans MS",
			fill : "#ffffff",
			align : "center",
		});
		
		
		//the background music loops
		if(onmusic = 0){
			this.backgroundMusic = game.add.audio('background', 0.2, true);
			this.backgroundMusic.play();
			onmusic = 1;
		}
		
		

		// click on the help button
		var helpBtn = game.add.sprite(0, 0, 'helpBtn');
		helpBtn.reset((game.width - helpBtn.width) / 2-150,
				(game.height - helpBtn.height) / 2 + 100);
		helpBtn.inputEnabled = true;
		helpBtn.events.onInputDown.add(this.helpGame);
		
		// click on the help button
		var infoBtn = game.add.sprite(0, 0, 'info');
		infoBtn.reset((game.width -infoBtn.width) / 2+150,
				(game.height - infoBtn.height) / 2 + 100);
		infoBtn.inputEnabled = true;
		infoBtn.events.onInputDown.add(this.showInfo);

		// add the swimming fish to the logo
		var actor = game.add.sprite(0, 0, 'actor');
		actor.reset((game.width - actor.width) / 2 - 100,
				(game.height - actor.height) / 2-80);
		actor.animations.add('swim');
		actor.animations.play('swim', 10, true);
		game.physics.arcade.enable(actor);
		
		var normal = game.add.sprite(0, 0, 'normal');
		normal.reset((game.width - normal.width) / 2,
				(game.height - normal.height) / 2 + 200);
		normal.inputEnabled = true;
		normal.events.onInputDown.add(this.startNormal);
		
		var easy = game.add.sprite(0, 0, 'easy');
		easy.reset((game.width - easy.width) / 2 - 200,
				(game.height - easy.height) / 2 + 200);
		easy.inputEnabled = true;
		easy.events.onInputDown.add(this.startEasy);
		
		var hard = game.add.sprite(0, 0, 'hard');
		hard.reset((game.width - hard.width) / 2 + 200,
				(game.height - hard.height) / 2 + 200);
		hard.inputEnabled = true;
		hard.events.onInputDown.add(this.startHard);

//		var space_key = this.game.input.keyboard
//				.addKey(Phaser.Keyboard.SPACEBAR);
//		space_key.onDown.add(this.start, this);
	},

	showInfo:function(){
		game.state.start("Info");
	},
	
	helpGame : function() {
		// help information
		game.state.start('help');
	},

	startEasy : function() {
		difficulty = 0;
		this.game.state.start('Main');
		
	},

	startNormal : function() {
		difficulty = 1;
		this.game.state.start('Main');
		
	},

	startHard : function() {
		difficulty = 2;
		this.game.state.start('Main');
		
	},
};

var ResultState = {
		preload : function() {

		
			game.stage.backgroundColor = '#58a7e8';

			game.load.image('again', 'assets/result images/again.png');
			game.load.image('back', 'assets/result images/back.png');
			game.load.spritesheet('actor', 'assets/images/actor.png', 99, 80, 2);

		},
		create : function() {
			
			
			if(difficulty == 0){
				var clearText = game.add.text(250, 100 , "Good job!", {
					font : "64px Comic Sans MS",
					fill : "#ffffff",
					align : "center",
				});
				
			}else if(difficulty == 1){
				var clearText = game.add.text(270, 100 , "Great!", {
					font : "64px Comic Sans MS",
					fill : "#ffffff",
					align : "center",
				});
				
			}else if(difficulty == 2){
				var clearText = game.add.text(250, 100 , "Excellent!", {
					font : "64px Comic Sans MS",
					fill : "#ffffff",
					align : "center",
				});
				
			}else if(difficulty > 2){
				var clearText = game.add.text(70, 100 , "You cleared! Unbelievable!", {
					font : "55px Comic Sans MS",
					fill : "#ffffff",
					align : "center",
				});
				
			}
			
			if(difficulty >2){
				difficulty = 2;
			}
			
			
			var resultText = game.add.text(250, 200 , "score: " + score, {
				font : "64px Comic Sans MS",
				fill : "#ffffff",
				align : "center",
			});
			

			
			var again = game.add.sprite(170,400, 'again');
			again.inputEnabled = true;
			again.events.onInputDown.add(this.again);
			
			var back = game.add.sprite(470,400, 'back');
			back.inputEnabled = true;
			back.events.onInputDown.add(this.back);

			
			var actor = game.add.sprite(130, 200, 'actor');
			actor.animations.add('swim');
			actor.animations.play('swim', 10, true);

		},
		
		again : function(){
			score = 0;
			game.state.start("Main");
			
		},
		back : function(){
			score = 0;
			game.state.start("Menu");
			
		},
		

	};

var InformationState = {
		preload : function(){
			game.stage.backgroundColor = '#58a7e8';
			game.load.image('reference', 'assets/Menu images/reference.png');
			game.load.image('fish[0]', 'assets/images/fish0.png');
			game.load.image('fish[1]', 'assets/images/fish1.png');
		},
		create:function(){

			game.add.sprite(10,40, 'reference');
			
			for(var i=20;i<650;i=i+150){
				game.add.sprite(i,500,'fish[0]');
				game.add.sprite(i+50,500,'fish[1]');
			}
			
		},
	
		

};

var RewardState = {

		preload : function() {
			game.stage.backgroundColor = '#58a7e8';

			game.load.image('ground', 'assets/images/ground.png');
			game.load.spritesheet('actor', 'assets/images/actor.png', 107, 80, 2);

			game.load.image('fish0', 'assets/images/fish0.png');
			game.load.image('coin', 'assets/images/coin.png');

			game.load.audio('jump', 'assets/music/waterReentry.wav');
			game.load.audio('eat', 'assets/music/eating.wav');
			game.load.audio('getCoin', 'assets/music/getCoin.wav');
		},

		create : function() {

			game.world.setBounds(0, 0, 10000, 550);
			game.physics.startSystem(Phaser.Physics.ARCADE);

			// add sounds
			this.jumpSound = game.add.audio('jump');
			this.jumpSound.volume = 0.2;

			this.eatSound = game.add.audio('eat');
			this.eatSound.volume = 0.2;

			this.getCoin = game.add.audio('getCoin');
			this.getCoin.volume = 0.2;

			// create actors and actor groups
			actor = game.add.sprite(100, 245, 'actor');

			ground = game.add.tileSprite(0, 550, 20000, 60, 'ground');

			// create blocks and enemy fishes
			coins = game.add.group();
			fishes0 = game.add.group();

			this.generateCoin();
			this.generateFish0();

			// make the main actor swim

			actor.animations.add('swim');
			actor.animations.play('swim', 10, true);
			game.physics.arcade.enable(actor);

			actor.body.velocity.x = 400;

		},

		update : function() {

			// give actor a gravity
			actor.body.gravity.y = 700;

			// give the actor an upward velocity
			if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				actor.body.velocity.y = -200;
				this.jumpSound.play();
			}

			// check if the main actor hits something
			game.physics.arcade.overlap(actor, coins, this.eatCoins, null, this);
			game.physics.arcade.overlap(actor, fishes0, this.fishCollision0, null,
					this);

			// make sure the actor would not swim out of the world
			if (actor.y < 0) {
				actor.y = 0;
			}
			if (actor.y > 470) {
				actor.body.gravity.y = 0;
				actor.y = 470;
			}

			game.camera.follow(actor);

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

			coin.kill();
			this.getCoin.play();

		},

		// if the main actor hits fish0, it will get 20 points
		fishCollision0 : function(actor, fish0) {

			this.eatSound.play();
			fish0.kill();

		},

	};




game.state.add('Menu', MenuState);
game.state.add('Main', MainState);
game.state.add('Result',ResultState);
game.state.add('Info',InformationState);
game.state.add('Rward',RewardState);
game.state.start('Rward');


