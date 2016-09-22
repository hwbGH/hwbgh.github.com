/**
 * 常量类
 * Created by Administrator on 2016/9/13.
 */
var Sprite = laya.display.Sprite;
var Text = laya.display.Text;
var Bitmap = laya.resource.Bitmap;
var Texture = laya.resource.Texture;
var Handler = laya.utils.Handler;
var Loader = laya.net.Loader;
var Animation = laya.display.Animation;
var Rectangle = laya.maths.Rectangle;
var Event = laya.events.Event;
var Pool = laya.utils.Pool;
var Browser = laya.utils.Browser;
var Stat = laya.utils.Stat;
var SoundManager = laya.media.SoundManager;
var Point = laya.maths.Point;
var Tween = laya.utils.Tween;
var LocalStorage = laya.net.LocalStorage;
var Socket = laya.net.Socket;
var Byte = laya.utils.Byte;
var Button = Laya.Button;
var Input = Laya.Input;
var Stage = laya.display.Stage;
var HttpRequest = laya.net.HttpRequest;
var WebGL = laya.webgl.WebGL;
var TimeLine = laya.utils.TimeLine;
var Label = laya.ui.Label;

var res = {

};
/**音效资源*/
var res_sound = {
    music_game : "res/music/game.mp3",
    sound_bullet : "res/sound/bullet.mp3",
    sound_fire : "res/sound/fire.mp3",
    sound_explode_plane : "res/sound/explode_plane.mp3"
};
var Config = {

    webServer: "ws://192.168.1.61:8080/ResinWebSocket/MyServlet?userId=",

    //游戏宽 高
    GameWidth: 1280,
    GameHeight: 720,

    //游戏宽 高
    GameWidthHalf: 640,
    GameHeightHalf: 360,

    //背景移动速度
    bgSpeed: 1,
    //游戏速度
    speed: 8,
    //最低速度
    SPEED_SLOW: 8,
    //最高速度
    SPEED_FAST: 12,
    //移动时间
    move_time: 2000,

    //是否暂停
    isPause: false,
    //是否结束
    isOver: false,

    /**方向*/
    begin_x: 300,
    /**方向*/
    begin_y: 360,

    /**方向*/
    direction_none: -1,
    /**方向*/
    direction_up: 0,
    /**方向*/
    direction_down: 1,
    /**方向*/
    direction_left: 2,
    /**方向*/
    direction_right: 3,
    /**方向*/
    direction_number: 4


};


