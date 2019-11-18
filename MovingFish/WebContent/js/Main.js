var game = new Phaser.Game(800, 600, Phaser.AUTO);

var actor;
var fishes1;
var speed = 5;
var fishHooks;
var grasses;

var mainState = {

	preload : function() {
		document.body.style.cursor = "none";
		game.stage.backgroundColor = '#2eaed9';

		game.load.image('fish1', 'assets/images/fish1.png');
		game.load.image('fish2', 'assets/images/fish2.png');
		game.load.image('fish3', 'assets/images/fish3.png');
		game.load.image('fish4', 'assets/images/fish4.png');
		game.load.image('fish5', 'assets/images/fish5.png');
		game.load.image('fishHook', 'assets/images/fish_hook.png');
		game.load.image('grass', 'assets/images/grass.png');
		game.load.spritesheet('actor', 'assets/images/actor.png', 144, 108, 2);

	},

	create : function() {

		game.world.setBounds(0, 0, 5000, 500);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		fishHooks = game.add.group();
		grasses = game.add.group();
		fishes1 = game.add.group();

		actor = game.add.sprite(100, 245, 'actor');

		this.generateFishHook();

		this.generateGrass();

		this.generateFish1();

		actor.animations.add('swim');
		actor.animations.play('swim', 10, true);

		game.physics.arcade.enable(actor);

		game.camera.follow(actor);
	},

	update : function() {

		actor.x = actor.x + 5;
		actor.y = actor.y + 2;

		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			actor.y -= speed;
		}

		game.physics.arcade.overlap(actor, grasses, this.hitBlock, null, this);
		game.physics.arcade
				.overlap(actor, fishHooks, this.hitBlock, null, this);
		game.physics.arcade.overlap(actor, fishes1, this.fishCollision1, null,
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

		for (var i = 0; i < 15; i++) {
			var topPosition = 0 - Math.random() * 150;
			var xPosition = Math.random() * 5000 + 100;
			var block = game.add.sprite(Math.ceil(xPosition), Math
					.ceil(topPosition), 'fishHook');
			fishHooks.add(block);
			game.physics.arcade.enable(block);

		}
	},

	generateGrass : function() {
		for (var i = 0; i < 15; i++) {
			var bottomPosition = 440 - Math.random() * 50;
			var xPosition = Math.random() * 5000 + 100;
			var block = game.add.sprite(Math.ceil(xPosition), Math
					.ceil(bottomPosition), 'grass');
			grasses.add(block);
			game.physics.arcade.enable(block);

		}
	},

	generateFish1 : function() {

		for (var i = 0; i < 8; i++) {
			var fish1 = game.add.sprite(
					Math.ceil((Math.random() * 5000 + 100)), Math.ceil(Math
							.random() * 500), 'fish1');
			fishes1.add(fish1);
			game.physics.arcade.enable(fish1);

		}

	},

	hitBlock : function() {

		this.restart();
	},

	fishCollision1 : function(actor, fish1) {

		fish1.destroy();

	},

	restart : function() {
		game.state.start('main');
	},

	render : function() {
		game.debug.cameraInfo(game.camera, 32, 120);
		game.debug.spriteInfo(actor, 32, 32);
	}

};

game.state.add('main', mainState);
game.state.start('main');

// https://www.iconfont.cn/search/index?q=%E6%B0%B4%E8%8D%89
// https://www.iconfont.cn/search/index?q=%E9%B1%BC%E9%92%A9
// https://opengameart.org/art-search?keys=fish
// https://www.iconfont.cn/search/index?q=%E5%88%BA
