var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var ActivityUI=(function(_super){
		function ActivityUI(){
			
		    this.loadingBar=null;
		    this.tipDialog=null;

			ActivityUI.__super.call(this);
		}

		CLASS$(ActivityUI,'ui.ActivityUI',_super);
		var __proto__=ActivityUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("ui.TipsDialogUI",ui.TipsDialogUI);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ActivityUI.uiView);
		}

		STATICATTR$(ActivityUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":640,"height":960},"child":[{"type":"Image","props":{"skin":"activity/bg.jpg","centerY":0,"centerX":0}},{"type":"ProgressBar","props":{"y":879,"x":15.000000000000046,"var":"loadingBar","skin":"activity/progress.png","sizeGrid":"16,15,16,15,1"}},{"type":"TipsDialog","props":{"y":0,"x":0,"var":"tipDialog","runtime":"ui.TipsDialogUI"}}]};}
		]);
		return ActivityUI;
	})(View);
var BattleUI=(function(_super){
		function BattleUI(){
			
		    this.elementPanel=null;
		    this.hpBar=null;
		    this.hpBar1=null;
		    this.hpBar2=null;
		    this.hpNumberLable=null;
		    this.btn_pause=null;
		    this.scoreLabel=null;
		    this.btn_skill0=null;
		    this.btn_skill1=null;
		    this.skillNumber0=null;
		    this.skillNumber1=null;
		    this.winImg=null;
		    this.readyBg=null;
		    this.readygo=null;
		    this.boss_hp=null;
		    this.batterImg=null;
		    this.batterLabel=null;
		    this.bossWarning=null;
		    this.tipDialog=null;
		    this.membrane=null;
		    this.btn_continue=null;
		    this.btn_exit=null;
		    this.loading1=null;
		    this.finger=null;

			BattleUI.__super.call(this);
		}

		CLASS$(BattleUI,'ui.BattleUI',_super);
		var __proto__=BattleUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("bean.ScaleButton",bean.ScaleButton);
			View.regComponent("ui.TipsDialogUI",ui.TipsDialogUI);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(BattleUI.uiView);
		}

		STATICATTR$(BattleUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":640,"height":960},"child":[{"type":"Sprite","props":{"y":3,"x":3,"width":640,"var":"elementPanel","height":960}},{"type":"ProgressBar","props":{"y":22,"x":5,"var":"hpBar","skin":"battle/progressBar.png","sizeGrid":"4,1,12,38,1"}},{"type":"ProgressBar","props":{"y":22,"x":5,"visible":false,"var":"hpBar1","skin":"battle/progressBar_hp1.png","sizeGrid":"4,1,12,38,1"}},{"type":"ProgressBar","props":{"y":22,"x":5,"visible":false,"var":"hpBar2","skin":"battle/progressBar_hp2.png","sizeGrid":"4,1,12,38,1"}},{"type":"Label","props":{"y":23,"x":218,"width":63,"var":"hpNumberLable","text":"X1","strokeColor":"#ff0000","stroke":2,"height":25,"fontSize":25,"font":"SimHei","color":"#ffffff","bold":true,"align":"left"}},{"type":"Button","props":{"y":34,"x":610,"var":"btn_pause","stateNum":"1","skin":"battle/btn_pause.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]},{"type":"Label","props":{"y":10,"x":218,"width":365,"var":"scoreLabel","height":52,"fontSize":52,"font":"SimHei","color":"#ffffff","align":"right"}},{"type":"Button","props":{"y":865,"x":77,"var":"btn_skill0","stateNum":"1","skin":"battle/btn_skill0.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]},{"type":"Button","props":{"y":865,"x":183,"var":"btn_skill1","stateNum":"1","skin":"battle/btn_skill1.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]},{"type":"Label","props":{"y":911,"x":52,"width":53,"var":"skillNumber0","height":17,"fontSize":17,"font":"SimHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":911,"x":158,"width":53,"var":"skillNumber1","height":17,"fontSize":17,"font":"SimHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":396,"visible":false,"var":"winImg","skin":"battle/ov.png","centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":367,"x":0,"visible":false,"var":"readyBg","skin":"battle/ready.png"}},{"type":"Image","props":{"y":354,"x":227,"visible":false,"var":"readygo","skin":"battle/readygo.png"}},{"type":"ProgressBar","props":{"y":81,"x":189,"visible":false,"var":"boss_hp","skin":"battle/progressBar_boss.png","sizeGrid":"5,3,4,2,1"}},{"type":"Image","props":{"y":263,"x":9,"visible":false,"var":"batterImg","skin":"battle/lianji.png","anchorY":0.5}},{"type":"Label","props":{"y":260,"x":95,"width":400,"visible":false,"var":"batterLabel","height":52,"font":"fontBattleNumber","anchorY":0.5,"align":"left"}},{"type":"Image","props":{"y":180,"visible":false,"var":"bossWarning","skin":"battle/bosswarning.png","centerX":0}},{"type":"TipsDialog","props":{"y":0,"x":0,"visible":false,"var":"tipDialog","runtime":"ui.TipsDialogUI"}},{"type":"Sprite","props":{"y":0,"x":0,"width":640,"visible":false,"var":"membrane","height":960}},{"type":"Button","props":{"y":353,"x":320,"visible":false,"var":"btn_continue","stateNum":"1","skin":"battle/btn_continue.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]},{"type":"Button","props":{"y":528,"x":320,"visible":false,"var":"btn_exit","stateNum":"1","skin":"battle/btn_exit.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]},{"type":"Image","props":{"y":393,"x":320,"visible":false,"var":"loading1","skin":"battle/ld3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Animation","props":{"y":366,"x":426,"visible":false,"var":"finger","source":"Finger.ani","autoPlay":true}}]};}
		]);
		return BattleUI;
	})(View);
var MenuUI=(function(_super){
		function MenuUI(){
			
		    this.btn_start=null;
		    this.check_sound=null;
		    this.finger=null;

			MenuUI.__super.call(this);
		}

		CLASS$(MenuUI,'ui.MenuUI',_super);
		var __proto__=MenuUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("bean.ScaleButton",bean.ScaleButton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MenuUI.uiView);
		}

		STATICATTR$(MenuUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":640,"height":960},"child":[{"type":"Image","props":{"skin":"activity/bg.jpg","centerY":0,"centerX":0}},{"type":"Image","props":{"y":166,"x":162,"skin":"menu/logo.png"}},{"type":"Button","props":{"y":804,"var":"btn_start","stateNum":"1","skin":"menu/btn_start.png","centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]},{"type":"CheckBox","props":{"y":114,"x":527,"var":"check_sound","stateNum":"2","skin":"menu/check_sound.png","selected":true,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]},{"type":"Animation","props":{"y":824,"x":325,"var":"finger","source":"Finger.ani","autoPlay":true}}]};}
		]);
		return MenuUI;
	})(View);
var RankUI=(function(_super){
		function RankUI(){
			
		    this.btn_again=null;
		    this.btn_share=null;
		    this.rankList=null;
		    this.score=null;

			RankUI.__super.call(this);
		}

		CLASS$(RankUI,'ui.RankUI',_super);
		var __proto__=RankUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("bean.ScaleButton",bean.ScaleButton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RankUI.uiView);
		}

		STATICATTR$(RankUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":640,"height":960},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"rank/bgb.jpg","centerY":0,"centerX":0}},{"type":"Image","props":{"y":27,"x":4,"skin":"rank/di.png"}},{"type":"Button","props":{"y":896,"var":"btn_again","stateNum":"1","skin":"rank/btn_again.png","centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]},{"type":"Button","props":{"y":896,"x":154,"visible":"false","var":"btn_share","stateNum":"1","skin":"rank/btn_share.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]},{"type":"Image","props":{"y":15,"x":170,"skin":"rank/bt.png"}},{"type":"List","props":{"y":95,"x":28,"width":590,"var":"rankList","vScrollBarSkin":"rank/vscroll.png","spaceY":9,"repeatY":7,"repeatX":1,"height":659},"child":[{"type":"Box","props":{"name":"render"},"child":[{"type":"Image","props":{"visible":true,"skin":"rank/lan.png","name":"boxBg"}},{"type":"Image","props":{"y":14,"x":30,"visible":true,"skin":"rank/rank_0.png","name":"medal"}},{"type":"Image","props":{"y":7.000000000000014,"x":133,"visible":true,"skin":"rank/touxiang.png","name":"head"}},{"type":"Label","props":{"y":31,"x":11,"width":118,"name":"rank","height":47,"font":"fontRankNumber","align":"center"}},{"type":"Label","props":{"y":46,"x":230,"width":145,"name":"name","height":22,"fontSize":22,"font":"SimHei","color":"#004280","align":"left"}},{"type":"Label","props":{"y":39,"x":375,"width":195,"name":"score","height":35,"fontSize":30,"font":"fontBattleNumber","align":"right"}}]}]},{"type":"Image","props":{"y":755,"x":66,"skin":"rank/fen.png"}},{"type":"Label","props":{"y":778,"x":288,"width":262,"var":"score","height":38,"fontSize":38,"font":"fontBattleNumber","align":"center"}},{"type":"Label","props":{"y":81,"width":210,"text":"排行榜每隔30分钟刷新一次","height":14,"fontSize":14,"font":"SimHei","color":"#ffffff","centerX":0,"align":"center"}}]};}
		]);
		return RankUI;
	})(View);
var TipsDialogUI=(function(_super){
		function TipsDialogUI(){
			
		    this.message=null;
		    this.btn_confirm=null;

			TipsDialogUI.__super.call(this);
		}

		CLASS$(TipsDialogUI,'ui.TipsDialogUI',_super);
		var __proto__=TipsDialogUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("bean.ScaleButton",bean.ScaleButton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(TipsDialogUI.uiView);
		}

		STATICATTR$(TipsDialogUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":640,"height":960},"child":[{"type":"Image","props":{"skin":"activity/dialogBg.png","centerY":0,"centerX":0}},{"type":"Label","props":{"y":349,"x":126,"wordWrap":true,"width":390,"var":"message","overflow":"scroll","height":225,"fontSize":18,"font":"SimHei","color":"#000000","align":"center"}},{"type":"Button","props":{"y":641,"x":320,"var":"btn_confirm","stateNum":"1","skin":"activity/button.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"isScale":true,"runtime":"bean.ScaleButton"}}]}]};}
		]);
		return TipsDialogUI;
	})(View);