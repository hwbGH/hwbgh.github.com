(function () {
	
	/**
	 * 加载类
	 */
	function Loading(){
		this.bg = null;
		this.txt = null;
		Loading.__super.call(this);
		this.init();
	}
	//Loading
	Laya.class(Loading,"Loading", laya.display.Sprite);
	
	var _proto = Loading.prototype;
	
	_proto.init = function(){
		
		//黑色背景
		this.bg = new Sprite();
		this.bg.graphics.drawRect(0,0,Config.GameWidth,Config.GameHeight,"#000000");
		this.addChild(this.bg);
		
		//loading文本
		this.txt = new Text();
		this.txt.color = "#ffffff";
		this.txt.fontSize = 30;
		this.txt.text = "Loading";
		this.txt.width = Config.GameWidth;
		this.txt.align = "center";
		this.txt.y = (Config.GameHeight - this.txt.height) * 0.5;
		this.addChild(this.txt);
		
	}
	_proto.progress = function(value){
		this.txt.text = "Loading " + parseInt(value * 100) + "%";
	}
	
})();