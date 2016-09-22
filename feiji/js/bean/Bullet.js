/**
 * 子弹
 * Created by Administrator on 2016/9/13.
 */
(function () {
    function Bullet() {
        /**游戏场景*/
        this.screen = null;
        /**所属阵营，玩家或敌人*/
        this.camp = 0;
        /**类型*/
        this.type = 0;
        /**攻击力*/
        this.attack = 1;
        /**移动速度*/
        this.speedX = 0;
        /**移动速度*/
        this.speedY = 0;
        //记录当前动作
        this.action = null;
        //动画
        this.body = null;
        /**碰撞范围的半径，x轴*/
        this.collisionWidth = 0;
        /**碰撞范围的半径，y轴*/
        this.collisionHeight = 0;
        /**攻击目标，给追踪弹使用*/
        this.track = null;
        /**攻击目标的类编号*/
        this.trackClassId = -1;

        Bullet.__super.call(this);
    }

    Laya.class(Bullet, "Bullet", Sprite);

    var _proto = Bullet.prototype;

    //飞
    Bullet.FLY = "bullet_move";
    //开火
    Bullet.FIRE = "bullet_fire";
    //状态
    Bullet.DIE = "bullet_die";
    //是否缓存了
    Bullet.cached = false;

    _proto.init = function (_screen, _x, _y, camp, type, attack, speedX, speedY) {
        this.screen = _screen;
        this.visible = true;
        this.rotation = 0;
        this.camp = camp;

        //动画缓存起来
        if (!Bullet.cached) {

            Bullet.cached = true;
            //根据不同的动画 来创建动画模板
            laya.display.Animation.createFrames(['bullet/0_0.png'], Bullet.FLY + "0_0");
            laya.display.Animation.createFrames(['bullet/0_10_0.png','bullet/0_10_1.png'], Bullet.FLY + "0_10");
            laya.display.Animation.createFrames(['bullet/0_100_0.png','bullet/0_100_1.png','bullet/0_100_2.png'
                ,'bullet/0_100_3.png','bullet/0_100_4.png','bullet/0_100_5.png','bullet/0_100_6.png'], Bullet.FLY + "0_100");
            laya.display.Animation.createFrames(['bullet/1_0.png'], Bullet.FLY + "1_0");
            laya.display.Animation.createFrames(['bullet/1_10.png'], Bullet.FLY + "1_10");
        }

        if (this.body == null) {
            this.body = new laya.display.Animation();
            if(camp == BulletManager.camp_player && type == BulletManager.type_player_big){
                this.body.interval = 100;
            }else{
                this.body.interval = 50;
            }
            this.addChild(this.body);

            //增加动画播放完成事件监听
            this.body.on(laya.events.Event.COMPLETE, this, this.onPlayComplete);
        }

        this.pos(_x, _y);
        this.type = type;
        this.attack = attack;
        this.speedX = speedX;
        this.speedY = speedY;

        //播放动作对应的动画
        this.playAction(Bullet.FLY + camp + "_" + type);

        //创建一个帧循环处理函数
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    _proto.onPlayComplete = function () {
        //大招播放完就消失
        if (this.action == Bullet.FLY + BulletManager.camp_player + "_" + BulletManager.type_player_big) {
            this.hide();
        }
    }

    /**
     * 播放动作对应的动画
     * action String 动作名称
     */
    _proto.playAction = function (action) {
        this.action = action;
        this.body.play(0, true, this.action);
        //获取动画的显示区域
        var bound = this.body.getBounds();
        this.collisionWidth = bound.width / 2;
        this.collisionHeight = bound.height / 2;
        this.body.pivot(this.collisionWidth, this.collisionHeight);
    }
    _proto.onLoop = function () {
        if(Config.isPause || Config.isOver || !this.visible){
            return;
        }

        if(this.camp == BulletManager.camp_player){
            if(this.type == BulletManager.type_player_missile){
                if(this.track && this.track.visible && this.trackClassId == this.track.classIndex){
                    //有目标并且该目标是初始的
                    var diff_x = this.track.x - this.x;
                    var diff_y = this.track.y - this.y;
                    if(diff_x == 0){
                        diff_x = 1;
                    }
                    var angle = Math.atan(diff_y / diff_x);

                    this.rotation = angle * 180 / Math.PI;
                    this.speedX = BulletManager.speed_player_missile * Math.cos(angle);
                    this.speedY = BulletManager.speed_player_missile * Math.sin(angle);
                    if(diff_x < 0){
                        this.speedX = -this.speedX;
                        this.speedY = -this.speedY;
                        this.rotation += 180;
                    }
                    this.x += this.speedX;
                    this.y += this.speedY;
                }else{
                    //丢失目标，重新定位
                    this.x += this.speedX;
                    this.y += this.speedY;
                    this.screen.reTrack(this);
                }
            }else{
                this.x += this.speedX;
                this.y += this.speedY;
            }
        }else{
            this.x += this.speedX;
            this.y += this.speedY;
        }

        if (this.x < 0 || this.x > Config.GameWidth ||
            this.y < 0 || this.y > Config.GameHeight) {//出界
            this.hide();
        }
    }

    /**
     * 消失隐藏
     * @param isSound 是否播放声效
     */
    _proto.hide = function (isSound) {
        this.rotation = 0;
        this.visible = false;
        //清空
        this.track = null;
        //从舞台移除
        this.removeSelf();
        //回收到对象池
        Laya.Pool.recover("Bullet", this);
        if(isSound){
            SoundManager.playSound(res_sound.sound_bullet);
        }
    }

    _proto.setTrack = function (_track) {
        this.track = _track;
        this.trackClassId = _track.classIndex;
    }

    /**
     * 当前是否是大招
     * @returns {boolean}
     */
    _proto.isBig = function () {
        if(this.type == BulletManager.type_player_big){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 发生碰撞时是否应该消失掉
     */
    _proto.shouldHide = function () {
        if(this.type == BulletManager.type_player_big){
            return false;
        }else{
            return true;
        }
    }



})();

