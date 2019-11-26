var actor;
var level = 2;
var fishes0;
var fishes1;
var fishes2;
var fishes3;
var speed = 5;
var fishHooks;
var grasses;

var mainState = {

	preload : function() {
		document.body.style.cursor = "none";
		game.stage.backgroundColor = '#2eaed9';

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
		game.load.spritesheet('actor', 'assets/images/actor1.png', 106, 80, 2);

	},

	create : function() {

		game.world.setBounds(0, 0, 20000, 550);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		var ground = game.add.tileSprite(0,550,20000,60,'ground'); 

		fishHooks = game.add.group();
		grasses = game.add.group();
		fishes0 = game.add.group();
		fishes1 = game.add.group();
		fishes2 = game.add.group();
		fishes3 = game.add.group();

		actor = game.add.sprite(100, 245, 'actor');

		this.generateFishHook();

		this.generateGrass();

		this.generateFish0();
		this.generateFish1();
		this.generateFish2();
		this.generateFish3();

		// check that there is no overlap pf any fishes
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

		actor.animations.add('swim');
		actor.animations.play('swim', 10, true);

		game.physics.arcade.enable(actor);
		actor.body.gravity.y = 700; // give actor a gravity
		actor.body.collideWorldBounds = true;// prevent actor from swimming
												// off the world

		game.camera.follow(actor);
	},

	update : function() {

		actor.x = actor.x + 5;

		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			actor.body.velocity.y = -200; // give the actor an upward velocity
		}

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

		if (actor.y < 0) {
			actor.y = 0;
		}
		if (actor.y > 500) {
			actor.y = 500;
		}

		game.world.wrap(actor, 0, true);
	},

	generateFishHook : function() {

		for (var i = 0; i < 5; i++) {
			var topPosition = 0 - Math.random() * 150;
			var xPosition = Math.random() * 2000 + 2000;
			var block = game.add.sprite(Math.ceil(xPosition), Math
					.ceil(topPosition), 'fishHook');
			fishHooks.add(block);
			game.physics.arcade.enable(block);

		}

		for (var i = 0; i < 50; i++) {
			var topPosition = 0 - Math.random() * 150;
			var xPosition = Math.random() * 16000 + 4000;
			var block = game.add.sprite(Math.ceil(xPosition), Math
					.ceil(topPosition), 'fishHook');
			fishHooks.add(block);
			game.physics.arcade.enable(block);

		}
	},

	generateGrass : function() {

		for (var i = 0; i < 5; i++) {
			var bottomPosition = 440 - Math.random() * 50;
			var xPosition = Math.random() * 2000 + 2000;
			var block = game.add.sprite(Math.ceil(xPosition), Math
					.ceil(bottomPosition), 'grass');
			grasses.add(block);
			game.physics.arcade.enable(block);

		}

		for (var i = 0; i < 50; i++) {
			var bottomPosition = 440 - Math.random() * 50;
			var xPosition = Math.random() * 16000 + 4000;
			var block = game.add.sprite(Math.ceil(xPosition), Math
					.ceil(bottomPosition), 'grass');
			grasses.add(block);
			game.physics.arcade.enable(block);

		}
	},

	generateFish0 : function() {

		// use 180 wo avoid add fishes in the area of fishhook
		for (var i = 0; i < 15; i++) {
			var fish0 = game.add.sprite(Math
					.ceil((Math.random() * 16000 + 4000)), 180 + Math.ceil(Math
					.random() * 300), 'fish0');
			fishes0.add(fish0);
			game.physics.arcade.enable(fish0);

		}

		// 让让让这个小水母上下移动了（如果觉得可以的话别的鱼到时候可以加点上下或者左右移动啥的
		game.add.tween(fishes0).to({
			y : 50
		}, 1000, null, true, 0, Number.MAX_VALUE, true);

	},

	generateFish1 : function() {

		for (var i = 0; i < 15; i++) {
			var fish1 = game.add.sprite(Math
					.ceil((Math.random() * 16000 + 4000)), 180 + Math.ceil(Math
					.random() * 300), 'fish1');
			fishes1.add(fish1);
			game.physics.arcade.enable(fish1);

		}

	},

	generateFish2 : function() {

		for (var i = 0; i < 15; i++) {
			var fish2 = game.add.sprite(Math
					.ceil((Math.random() * 16000 + 4000)), 180 + Math.ceil(Math
					.random() * 300), 'fish2');
			fishes2.add(fish2);
			game.physics.arcade.enable(fish2);

		}

	},

	generateFish3 : function() {

		for (var i = 0; i < 15; i++) {
			var fish3 = game.add.sprite(Math
					.ceil((Math.random() * 16000 + 4000)), 180 + Math.ceil(Math
					.random() * 300), 'fish3');
			fishes3.add(fish3);
			game.physics.arcade.enable(fish3);

		}

	},

	hitBlock : function() {

		this.restart();
	},

	checkOverlap : function(fishG1, fishG2) {

		fishG1.kill();// hide the overlapping fish

	},

	fishCollision0 : function(actor, fish0) {

		if (level == 1) {
			fish0.kill();
			game.add.tween(actor.scale).to({
				x : 1,
				y : 1
			}, 100, Phaser.Easing.Linear.None, true);
			fish0.kill();
			level = 2;
		} else if (level == 2) {
			fish0.kill();
		} else if (level == 3) {
			fish0.kill();
		}

	},

	fishCollision1 : function(actor, fish1) {

		if (level == 2) {
			game.add.tween(actor.scale).to({
				x : 1.3,
				y : 1.3
			}, 100, Phaser.Easing.Linear.None, true);
			
			deadX = fish1.x;
			deadY = fish1.y;
			var dead1 = game.add.sprite(deadX, deadY, 'dead1');
			game.physics.enable(dead1, Phaser.Physics.ARCADE);  
			dead1.body.velocity.y = -50;  
			
			fish1.kill();
			level = 3;
		} else if (level == 3) {
			deadX = fish1.x;
			deadY = fish1.y;
			var dead1 = game.add.sprite(deadX, deadY, 'dead1');
			game.physics.enable(dead1, Phaser.Physics.ARCADE);  
			dead1.body.velocity.y = -50;  
			
			fish1.kill();
		}

	},

	fishCollision2 : function(actor, fish2) {

		if (level == 3) {
			fish2.kill();
			
			deadX = fish2.x;
			deadY = fish2.y;
			var dead2 = game.add.sprite(deadX, deadY, 'dead2');
			game.physics.enable(dead2, Phaser.Physics.ARCADE);  
			dead2.body.velocity.y = -50;  
			
		} else if (level == 1) {
			this.restart();
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

		}

	},

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
		} else if (level == 2) {
			this.restart();
		}

	},

	restart : function() {
		game.state.start('main');
		level = 2;
	},

	render : function() {
		game.debug.cameraInfo(game.camera, 32, 120);
		game.debug.spriteInfo(actor, 32, 32);
	}

};

// https://www.iconfont.cn/search/index?q=%E6%B0%B4%E8%8D%89
// https://www.iconfont.cn/search/index?q=%E9%B1%BC%E9%92%A9
// https://opengameart.org/art-search?keys=fish
// https://www.iconfont.cn/search/index?q=%E5%88%BA

