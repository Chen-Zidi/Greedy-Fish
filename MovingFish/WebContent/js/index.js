window.game = new Phaser.Game(800, 600, Phaser.AUTO,"game");

game.state.add('Menu',Menu);
game.state.add('main', mainState);
game.state.start('Menu');


