var game = new Phaser.Game(800, 600, Phaser.AUTO);

var actor;
var fishes;
var speed = 5;
var fishHooks;
var grass;
var chaser;

var mainState = {

	preload : function() {
		document.body.style.cursor = "none";
		game.stage.backgroundColor = '#2eaed9';

		game.load.image('fish1', 'assets/images/fish1.png');
		game.load.image('fish2', 'assets/images/fish2.png');
		game.load.image('fish3', 'assets/images/fish3.png');
		game.load.image('fish4', 'assets/images/fish4.png');
		game.load.image('fish5', 'assets/images/fish5.png');
		game.load.image('chaser', 'assets/images/chaser.png');
		game.load.image('fishHook', 'assets/images/fish_hook.png');
		game.load.image('grass', 'assets/images/grass.png');
		game.load.spritesheet('actor', 'assets/images/actor.png', 144, 108, 2);

	},

	create : function() {

		game.world.setBounds(0, 0, 5000, 500);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		fishes = game.add.group();
		fishHooks = game.add.group();
		grass = game.add.group();

		actor = game.add.sprite(100, 245, 'actor');
		chaser = game.add.sprite(10, 0, 'chaser');
		for (var i = 0; i < 7; i++) {
			var block = game.add.sprite(
					Math.ceil((Math.random() * 5000 + 100)), 0, 'fishHook');
			fishHooks.add(block);
			game.physics.arcade.enable(block);

		}

		for (var i = 0; i < 15; i++) {
			var block = game.add.sprite(
					Math.ceil((Math.random() * 5000 + 100)), 440, 'grass');
			grass.add(block);
			game.physics.arcade.enable(block);

		}

		actor.animations.add('swim');
		actor.animations.play('swim', 10, true);

		game.physics.arcade.enable(actor);
		game.physics.arcade.enable(chaser);

		game.camera.follow(actor);
	},

	update : function() {

		chaser.x = chaser.x + 4;

		if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			actor.y -= speed;
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {

			actor.y += speed;
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			actor.x += speed;
		}

		game.physics.arcade.overlap(actor, grass, this.hitBlock, null, this);
		game.physics.arcade
				.overlap(actor, fishHooks, this.hitBlock, null, this);
		game.physics.arcade.overlap(actor, chaser, this.hitBlock, null, this);

		if (actor.y < 0) {
			actor.y = 0;
		}
		if (actor.y > 500) {
			actor.y = 500;
		}

		game.world.wrap(actor, 0, true);
		game.world.wrap(chaser, 0, true);
	},

	hitBlock : function() {

		this.restart();
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
