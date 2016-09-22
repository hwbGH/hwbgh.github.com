var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var BackpackUI=(function(_super){
		function BackpackUI(){
			

			BackpackUI.__super.call(this);
		}

		CLASS$(BackpackUI,'ui.BackpackUI',_super);
		var __proto__=BackpackUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(BackpackUI.uiView);
		}

		STATICATTR$(BackpackUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":600,"name":"icon","height":400},"child":[{"type":"Image","props":{"width":600,"skin":"ui/dialogback.png","sizeGrid":"40,20,60,20","height":400,"centerY":0.5,"centerX":0.5}},{"type":"Label","props":{"top":10,"text":"背包","fontSize":30,"color":"#ffffff","centerX":0.5,"bold":true}},{"type":"List","props":{"width":560,"spaceX":120,"repeatX":4,"height":330,"centerX":0.5,"bottom":15},"child":[{"type":"Box","props":{"top":10,"left":20},"child":[{"type":"Image","props":{"skin":"ui/bpgBg.png","name":"icon","centerY":0.5,"centerX":0.5}},{"type":"Label","props":{"name":"number","centerX":0.5,"bottom":10}}]}]},{"type":"Button","props":{"top":10,"skin":"ui/button_close.png","right":15,"name":"close"}}]};}
		]);
		return BackpackUI;
	})(Dialog);
var GameUI=(function(_super){
		function GameUI(){
			
		    this.button_shield=null;
		    this.button_skill=null;
		    this.hp_bg=null;
		    this.hp_bar=null;

			GameUI.__super.call(this);
		}

		CLASS$(GameUI,'ui.GameUI',_super);
		var __proto__=GameUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(GameUI.uiView);
		}

		STATICATTR$(GameUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"Button","props":{"var":"button_shield","stateNum":"2","skin":"ui/button_shield.png","right":100,"bottom":100}},{"type":"Button","props":{"y":-83.00000000000001,"var":"button_skill","stateNum":"2","skin":"ui/button_skill.png","right":250,"bottom":100}},{"type":"Image","props":{"var":"hp_bg","top":20,"skin":"ui/hp_bg.png","left":20},"child":[{"type":"Image","props":{"y":20,"x":47,"var":"hp_bar","skin":"ui/hp_bar.png"}}]}]};}
		]);
		return GameUI;
	})(View);