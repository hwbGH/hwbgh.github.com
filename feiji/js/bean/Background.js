(function () {
    /**
     * 背景类
     * @param index 地图编号
     */
	function Background(index){
        /***/
        this.state = 0;
        //定义背景1
        this.bg1 = null;

		Background.__super.call(this);
		this.init(index);
	}
    /**状态，移动*/
    Background.state_move = 0;
    /**状态，停止*/
    Background.state_stop = 1;

	//Background 是一个显示对象 继承此 Sprite
	Laya.class(Background, "Background", Sprite);
	
	var _proto = Background.prototype;
	
	_proto.init = function(index){
        var texture1 = Laya.loader.getRes("res/bg/game" + index + ".jpg");
        //创建背景1
        this.bg1 = new Sprite();
        //绘制背景图1
        this.bg1.graphics.drawTexture(texture1, 0, 0);
        this.bg1.graphics.drawTexture(texture1, Config.GameWidth, 0);
        //把背景1添加到当前容器对象里。
        this.addChild(this.bg1);

        this.onMove();

        //创建一个帧循环处理函数，用于背景位置的更新，实现背景滚动效果。
        Laya.timer.frameLoop(1, this, this.onLoop);
	}

    _proto.onMove = function(){
        this.state = Background.state_move;
    }

    _proto.onStop = function(){
        this.state = Background.state_stop;
    }
    
    _proto.onLoop = function(){
        if(Config.isPause || Config.isOver){
            return;
        }
        if(this.state != Background.state_move){
            return;
        }

        //移动
        this.bg1.x -= Config.bgSpeed;

        if (this.bg1.x + Config.GameWidth <= 0) {
            this.bg1.x += Config.GameWidth;
        }

    }
	
	
})();