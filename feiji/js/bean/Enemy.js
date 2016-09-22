/**
 * 敌机
 * Created by Administrator on 2016/9/14.
 */
(function () {
    function Enemy() {
        /**类编号*/
        this.classIndex = 0;
        //记录当前动作
        this.action = null;
        //玩家
        this.body = null;
        /**碰撞范围的半径（宽度的一半），x轴*/
        this.collisionWidth = 0;
        /**碰撞范围的半径（高度的一半），y轴*/
        this.collisionHeight = 0;
        /**图片宽度*/
        this.boundWidth = 0;
        /**图片高度*/
        this.boundHeight = 0;

        /**编号*/
        this.index = 0;
        /**生命*/
        this.hp = 1;
        /**生命上限*/
        this.hp_limit = 1;
        /**攻击力*/
        this.attack = 1;
        /**防御*/
        this.defense = 0;
        /**射击时刻，毫秒数*/
        this.shootTime = 0;
        /**射击间隔，毫秒数*/
        this.shootCd = 99999999;
        this.speedX = 0;
        this.speedY = 0;
        this.radian = 0;
        this.radianSpeed = 0;

        Enemy.__super.call(this);
    }

    Enemy.CLASSID = 0;
    //玩家动作
    //飞
    Enemy.FLY = "enemy_run";
    //开火
    Enemy.FIRE = "enemy_fire";
    //状态
    Enemy.DIE = "enemy_die";

    //Enemy
    Laya.class(Enemy, "Enemy", Sprite);

    var _proto = Enemy.prototype;

    //是否缓存了
    Enemy.cached = false;

    _proto.init = function (index, _x, _y, hp, attack, defense, shootCd,speedX,speedY) {
        this.classIndex = Enemy.CLASSID++;
        this.visible = true;

        this.index = index;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.shootCd = shootCd;
        this.hp_limit = hp;
        this.speedX = speedX;
        this.speedY = speedY;

        //动画缓存起来
        if (!Enemy.cached) {
            Enemy.cached = true;
            //根据不同的动画 来创建动画模板
            laya.display.Animation.createFrames(['enemy/0_0.png', 'enemy/0_1.png',
                'enemy/0_2.png', 'enemy/0_3.png'], Enemy.FLY + "0");
            laya.display.Animation.createFrames(['enemy/1_0.png', 'enemy/1_1.png',
                'enemy/1_2.png', 'enemy/1_3.png'], Enemy.FLY + "1");
            laya.display.Animation.createFrames(['enemy/100_0.png', 'enemy/100_1.png',
                'enemy/100_2.png', 'enemy/100_3.png', 'enemy/100_4.png'], Enemy.FLY + "100");
        }

        if (this.body == null) {
            this.body = new laya.display.Animation();
            //this.body.pivot(48, 60);
            this.body.interval = 100;
            this.addChild(this.body);
        }

        this.pos(_x, _y);
        this.shootTime = Browser.now() + this.shootCd;
        /**受到主角大招伤害的时刻*/
        this.hurtTime = 0;

        //播放动作对应的动画
        this.playAction(Enemy.FLY + index);

        this.moveTween();

        //创建一个帧循环处理函数
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    /**
     * 播放动作对应的动画
     * action String 动作名称
     */
    _proto.playAction = function (action) {
        //如果是重复的动作 不执行
        if (this.action == action){
            return;
        }
        this.action = action;
        this.body.play(0, true, this.action);
        //获取动画的显示区域
        var bound = this.body.getBounds();
        this.boundWidth = bound.width;
        this.boundHeight = bound.height;
        this.collisionWidth = bound.width / 2;
        this.collisionHeight = bound.height / 2;
        //设置机身的锚点为机身的显示宽高的中心点。
        this.body.pivot(this.collisionWidth, this.collisionHeight);

        /**把范围缩小一点*/
        this.collisionWidth = bound.width / 2 - 20;
        this.collisionHeight = bound.height / 2 - 20;
    }

    _proto.onLoop = function () {
        if(Config.isPause || Config.isOver || !this.visible){
            return;
        }

        this.move();

        var currentTime = Browser.now();
        if(this.shootTime <= currentTime){
            this.shootTime = currentTime + this.shootCd;
            this.event(Enemy.FIRE, this);
        }
    }


    _proto.moveTween = function () {
        this.radian = 0;
        this.radianSpeed = getRandomBetween(0.001, 0.05);

        switch (this.index){
            case EnemyManager.index_tween:
                //var tempX = EnemyManager.min_x;
                //var tempY = 0;
                //if(this.y < Config.GameHeightHalf){
                //    tempY = getRandomBetweenInt(Config.GameHeight * 0.75, Config.GameHeight);
                //}else{
                //    tempY = getRandomBetweenInt(0, Config.GameHeight * 0.25);
                //}
                //var number = 20;
                //var distance = (this.x - EnemyManager.min_x)/number;
                //var timeLine = new TimeLine();
                //for(var i = 0; i < number; i++){
                //    timeLine = timeLine.to(this, {}, distance / );
                //}
                //timeLine.play(0,false);
                //
                //
                //Tween.to(character,
                //    {
                //        x: 350,
                //        y: 250
                //    }, duration, Ease[list.selectedItem]);
                break;
        }
    }

    _proto.move = function () {
        if(this.index == EnemyManager.index_line){
            this.x += this.speedX;
            this.y += this.speedY;
            if(this.x < EnemyManager.min_x){
                this.hide();
                //}else if(this.x > EnemyManager.max_x){
                //    this.x -= this.speedX;
            }else if(this.y < EnemyManager.min_y || this.y > EnemyManager.max_y){
                this.speedY = -this.speedY;
            }
        }else if(this.index == EnemyManager.index_tween){
            this.x += this.speedX;
            this.y += this.speedY * Math.sin(this.radian);
            this.radian += this.radianSpeed;
            if(this.x < EnemyManager.min_x || this.x > EnemyManager.max_x * 2){
                this.hide();
            }else if(this.y < EnemyManager.min_y || this.y > EnemyManager.max_y){
                this.speedY = -this.speedY;
            }
        }else if(this.index >= EnemyManager.index_boss){
            this.x += this.speedX;
            if(this.x <= EnemyManager.boss_x){
                this.speedX = 0;
            }
        }
    }

    /**
     * 消失隐藏
     */
    _proto.hide = function () {
        this.visible = false;
        //从舞台移除
        this.removeSelf();
        //回收到对象池
        Laya.Pool.recover("Enemy", this);
    }

    /**
     * 当前是否能够无视碰撞检测
     * @returns {boolean}
     */
    _proto.isDisregard = function (bullet) {
        if(bullet.isBig()){
            var current = Browser.now();
            if(this.hurtTime + BulletManager.hurtCd <= current){
                //有效时间内
                this.hurtTime = current;
                return true;
            }
            return false;
        }else{
            return false;
        }
    }

    /**
     * 与子弹的碰撞
     * @param bullet
     * @param screen
     */
    _proto.collisionLogic = function (bullet, screen) {
        if(!this.visible || !bullet.visible || this.isDisregard(bullet)){
            return;
        }
        var tempX = Math.abs(this.x - bullet.x);
        var tempY = Math.abs(this.y - bullet.y);
        if(bullet.isBig() || (tempX <  this.collisionWidth + bullet.collisionWidth
            && tempY < this.collisionHeight + bullet.collisionHeight)){
            //碰撞了
            var value = bullet.attack - this.defense;
            if(value <= 0){
                value = 1;//至少打一点血
            }
            this.beHurt(value);
            if(bullet.shouldHide()){
                bullet.hide(true);
            }
            if(this.hp <= 0){//飞机爆炸
                if(this.index >= EnemyManager.index_boss){//boss
                    screen.addExplode(this.x, this.y, Explode.PLANE, 10);
                    screen.addExplode(this.x + 50, this.y, Explode.PLANE, 10);
                    screen.addExplode(this.x, this.y + 50, Explode.PLANE, 10);
                    screen.addExplode(this.x - 50, this.y, Explode.PLANE, 10);
                    screen.addExplode(this.x, this.y - 50, Explode.PLANE, 10);
                }else{
                    screen.addExplode(this.x, this.y, Explode.PLANE, 0);
                }
            }else{//子弹爆炸
                screen.addExplode(bullet.x, bullet.y, Explode.BULLET, 0);
            }
        }
    }

    /**
     * 受伤
     * @param value
     */
    _proto.beHurt = function (value) {
        this.hp -= value;
        this.event(HurtText.create, [this.x, this.y, value]);
        if(this.hp < 0){
            this.hp = 0;
            this.hide();
            SoundManager.playSound(res_sound.sound_explode_plane);
            if(enemyManager.isBoss(this.index)){
                //boss死亡
                this.event(Enemy.DIE);
            }
        }
    }


})();