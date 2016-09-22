/**
 * Created by Administrator on 2016/9/2.
 */

//laya初始化
Laya.init(Config.GameWidth, Config.GameHeight, Laya.WebGL);
//FPS
//Laya.Stat.show(0,100);
//设置适配模式Stage.SCALE_EXACTFIT,Stage.SCALE_FIXED_HEIGHT,Stage.SCALE_FIXED_WIDTH
Laya.stage.scaleMode = Stage.SCALE_EXACTFIT;
//设置剧中对齐
Laya.stage.alignH = "center";
//设置横屏
Laya.stage.screenMode = "horizontal";

//loading
var loading = new Loading();
Laya.stage.addChild(loading);


//加载单个资源
var asset = [];
asset.push({
    url: [
        "res/bg/game0.jpg"
    ],
    type: Laya.Loader.IMAGE
});
//加载图集资源
asset.push({
    url: "res/atlas/player.json",
    type: Laya.Loader.ATLAS
    },
    {
        url: "res/atlas/bullet.json",
        type: Laya.Loader.ATLAS
    },
    {
        url: "res/atlas/enemy.json",
        type: Laya.Loader.ATLAS
    },
    {
        url: "res/atlas/explode.json",
        type: Laya.Loader.ATLAS
    },
    {
        url: "res/atlas/shield.json",
        type: Laya.Loader.ATLAS
    },
    {
        url: "res/atlas/battle_ctrl.json",
        type: Laya.Loader.ATLAS
    },
    {
        url: "res/atlas/ui.json",
        type: Laya.Loader.ATLAS
    }
);

//加载声音资源
asset.push({
    url: res_sound.music_game,
    type: Laya.Loader.SOUND
});

//加载图集资源
Laya.loader.load(asset, Handler.create(this, onLoaded), Handler.create(this, onLoading, null, false));

//游戏介绍点击进入 开始游戏咯
function onMouseDown() {
    Config.isPause = false;
}
//加载进度
function onLoading(progress) {
    //console.log("onLoading: " + progress);
}
//加载完毕
function onLoaded() {
    //alert("ccccccccccc");
    //console.log("onLoaded");
    //加载完毕移除loading 显示游戏提示UI 并且初始化游戏
    Laya.stage.removeChild(loading);
    //实例化RunGame
    Laya.stage.addChild(new GameScreen(0));
}


