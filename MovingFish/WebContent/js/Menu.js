var Menu = {
    preload: function () {
        //加载游戏所需元素
    	game.world.setBounds(0, 0, 5000, 500);
		game.stage.backgroundColor = '#2eaed9';

    	game.load.image('logo2','assets/Menu images/logo2.png');
        game.load.image('helpBtn','assets/Menu images/help.png');
        game.load.spritesheet('actor','assets/images/actor1.png',106,80,2);
    },
    create: function () {
		var logo2 = game.add.image(0, 0 ,'logo2');
        logo2.reset((game.width - logo2.width) / 2, (game.height - logo2.height) / 2 - 50);
        

        //点击helpbutton
        var helpBtn =  game.add.sprite(0, 0, 'helpBtn');
        helpBtn.reset((game.width - helpBtn.width) / 2, (game.height - helpBtn.height) / 2 + 200);
        helpBtn.inputEnabled = true;
        helpBtn.events.onInputDown.add(this.helpGame);
        
        //会游泳的鱼
        var actor = game.add.sprite(0, 0, 'actor');
        actor.reset((game.width - actor.width) / 2-100, (game.height - actor.height) / 2);
        actor.animations.add('swim');
        actor.animations.play('swim',10,true);
        game.physics.arcade.enable(actor);
       
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);        //定义接受按键消息变量
        space_key.onDown.add(this.start,this);   
    },
    
    helpGame: function () {
    	//帮助界面
        game.state.start('help');
    },
    
    start:function(){
        this.game.state.start('main');        //调用start()函数后进入'ready'state
    }
};