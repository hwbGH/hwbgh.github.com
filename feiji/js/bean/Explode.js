/**
 * 爆炸动画
 * Created by Administrator on 2016/9/18.
 */
(function(){

    function Explode() {
        //动画
        this.body = null;

        Explode.__super.call(this);
    }

    Laya.class(Explode, "Explode", Sprite);

    var _proto = Explode.prototype;

    //机体
    Explode.PLANE = "bullet_plane";
    //玩家
    //子弹
    Explode.BULLET = "bullet_bullet";
    //是否缓存了
    Explode.cached = false;

    _proto.init = function (_x, _y, type) {
        this.visible = true;

        //动画缓存起来
        if (!Explode.cached) {

            Explode.cached = true;
            //根据不同的动画 来创建动画模板
            laya.display.Animation.createFrames(['explode/explode0.png','explode/explode1.png','explode/explode2.png'
                ,'explode/explode3.png','explode/explode4.png','explode/explode5.png','explode/explode6.png',
                'explode/explode7.png','explode/explode8.png','explode/explode9.png','explode/explode10.png'
                ,'explode/explode11.png','explode/explode12.png','explode/explode13.png','explode/explode14.png'
                ,'explode/explode15.png','explode/explode16.png','explode/explode17.png'], Explode.PLANE);
            laya.display.Animation.createFrames(['explode/bullet0.png','explode/bullet1.png','explode/bullet2.png',
                'explode/bullet3.png','explode/bullet4.png'], Explode.BULLET);
        }

        if (this.body == null) {
            this.body = new laya.display.Animation();
            this.body.interval = 50;
            this.addChild(this.body);

            //增加动画播放完成事件监听
            this.body.on(laya.events.Event.COMPLETE, this, this.onPlayComplete);
        }

        this.pos(_x, _y);

        //播放动作对应的动画
        this.playAction(type);

        //创建一个帧循环处理函数
        Laya.timer.frameLoop(1, this, this.onLoop);
    }
    _proto.onPlayComplete = function () {
        //从舞台移除
        this.removeSelf();
        //回收到对象池
        Laya.Pool.recover("Explode", this);
    }

    /**
     * 播放动作对应的动画
     * action String 动作名称
     */
    _proto.playAction = function (action) {
        this.body.play(0, true, action);
        //获取动画的显示区域
        var bound = this.body.getBounds();
        //设置机身的锚点为机身的显示宽高的中心点。
        this.body.pivot(bound.width / 2, bound.height / 2);
    }
    _proto.onLoop = function () {

    }

} )();