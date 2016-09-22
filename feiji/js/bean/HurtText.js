/**
 * 掉血
 * Created by Administrator on 2016/9/21.
 */
(function () {
    function HurtText() {
        /**移动计数*/
        this.moveCount = 0;
        this.speedX = 0;
        this.speedY = 0;
        HurtText.__super.call(this);
    }

    Laya.class(HurtText, "HurtText", Label);

    var _proto = HurtText.prototype;

    /**每个新文字移动的次数*/
    HurtText.create = "create_hurtText";
    /**每个新文字移动的次数*/
    HurtText.move_step = 40;
    /**速率*/
    HurtText.speed = 2;
    /**角度间隔*/
    HurtText.interval = 0.01;
    /**角度*/
    HurtText.angle = -Math.PI / 2;
    /**角度*/
    HurtText.angleMin = -Math.PI / 4 * 3;
    /**角度*/
    HurtText.angleMax = -Math.PI / 4;

    _proto.init = function (_x, _y, _text) {
        this.color = "#ff0000";
        this.fontSize = 20;
        this.bold = true;
        this.align = "center";
        this.valign = 'middle';

        this.pos(_x, _y);
        this.changeText(_text);//this.text = _text;
        this.visible = true;
        this.moveCount = HurtText.move_step;

        var angle = getRandomBetween(HurtText.angleMin, HurtText.angleMax);
        this.speedX = HurtText.speed * Math.cos(angle);
        this.speedY = HurtText.speed * Math.sin(angle);
        //HurtText.angle += HurtText.interval;
        //if(HurtText.angle > HurtText.angleMax){
        //    HurtText.angle = HurtText.angleMin;
        //}

        //创建一个帧循环处理函数
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    _proto.onLoop = function () {
        if(Config.isPause || Config.isOver || !this.visible){
            return;
        }

        this.moveCount--;
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.moveCount <= 0){
            this.hide();
        }
    }

    /**
     * 消失隐藏
     */
    _proto.hide = function () {
        this.rotation = 0;
        this.visible = false;
        //清空
        this.track = null;
        //从舞台移除
        this.removeSelf();
        //回收到对象池
        Laya.Pool.recover("HurtText", this);
    }
})();

