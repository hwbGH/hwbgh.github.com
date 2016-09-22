/**
 * 摇杆
 * Created by Administrator on 2016/9/20.
 */
(function () {
    function Rocker(){
        /**中间底*/
        this.rocker_bg = null;
        /**外围圈，普通*/
        this.rocker_round = null;
        /**外围圈，高亮*/
        this.rocker_round_h = null;
        /**方向舵，普通*/
        this.dir_ctrl = null;
        /**方向舵，高亮*/
        this.dir_ctrl_h = null;

        /***/
        this.defaultX = 100;
        /***/
        this.defaultY = Config.GameHeight - this.height - 100;

        /**半径*/
        this.radius = 1;
        this.widthHalf = 1;
        this.heightHalf = 1;

        Rocker.__super.call(this);
        this.init();
    }

    //Rocker 是一个显示对象 继承此 Sprite
    Laya.class(Rocker, "Rocker", Sprite);

    var _proto = Rocker.prototype;

    _proto.init = function(){
        this.alpha = 0.8;
        //this.mouseEnabled = true;
        this.width = 253;//必须设置高宽，以最大框为准
        this.height = 253;//必须设置高宽，以最大框为准
        this.widthHalf = this.width / 2;
        this.heightHalf = this.height / 2;
        this.pos(this.defaultX, this.defaultY);

        this.rocker_bg = new Sprite();
        this.rocker_bg.loadImage("battle_ctrl/rocker_bg.png");
        this.addChild(this.rocker_bg);
        var bound = this.rocker_bg.getBounds();
        var tempW = bound.width / 2;
        this.rocker_bg.pivot(tempW, bound.height / 2);
        this.rocker_bg.pos(this.widthHalf, this.heightHalf);
        this.radius = tempW;//设置半径，是园底的半径

        this.rocker_round = new Sprite();
        this.rocker_round.loadImage("battle_ctrl/rocker_round.png");
        this.addChild(this.rocker_round);
        bound = this.rocker_round.getBounds();
        this.rocker_round.pivot(bound.width / 2, bound.height / 2);
        this.rocker_round.pos(this.widthHalf, this.heightHalf);

        this.rocker_round_h = new Sprite();
        this.rocker_round_h.loadImage("battle_ctrl/rocker_round_h.png");
        this.rocker_round_h.visible = false;
        this.addChild(this.rocker_round_h);
        bound = this.rocker_round_h.getBounds();
        this.rocker_round_h.pivot(bound.width / 2, bound.height / 2);
        this.rocker_round_h.pos(this.widthHalf, this.heightHalf);

        this.dir_ctrl = new Sprite();
        this.dir_ctrl.loadImage("battle_ctrl/dir_ctrl.png");
        this.addChild(this.dir_ctrl);
        bound = this.dir_ctrl.getBounds();
        this.dir_ctrl.pivot(bound.width / 2, bound.height / 2);
        this.dir_ctrl.pos(this.widthHalf, this.heightHalf);

        this.dir_ctrl_h = new Sprite();
        this.dir_ctrl_h.loadImage("battle_ctrl/dir_ctrl_h.png");
        this.dir_ctrl_h.visible = false;
        this.addChild(this.dir_ctrl_h);
        bound = this.dir_ctrl_h.getBounds();
        this.dir_ctrl_h.pivot(bound.width / 2, bound.height / 2);
        this.dir_ctrl_h.pos(this.widthHalf, this.heightHalf);
    }

    _proto.onRockerDown = function () {
        this.rocker_round.visible = false;
        this.rocker_round_h.visible = true;
        this.dir_ctrl.visible = false;
        this.dir_ctrl_h.visible = true;
    }

    _proto.onRockerMove = function(_x, _y){
        this.dir_ctrl_h.pos(this.widthHalf + _x, this.heightHalf + _y);
    }

    _proto.onRockerUp = function(){
        this.rocker_round.visible = true;
        this.rocker_round_h.visible = false;
        this.dir_ctrl.visible = true;
        this.dir_ctrl_h.visible = false;
    }



})();