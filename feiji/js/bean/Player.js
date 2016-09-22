(function () {

    /**
     * 玩家类
     */

    function Player(shootCd, missileCd) {
        //记录当前动作
        this.action = null;
        //玩家
        this.body = null;
        /**碰撞范围的半径，x轴*/
        this.collisionWidth = 0;
        /**碰撞范围的半径，y轴*/
        this.collisionHeight = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.nextX = 0;
        this.nextY = 0;
        /**生命*/
        this.hp = 1000;
        /**生命上限*/
        this.hp_limit = 1000;
        /**攻击力*/
        this.attack = 10;
        /**防御力*/
        this.defense = 1;
        /**射击时刻，毫秒数*/
        this.shootTime = 0;
        /**导弹射击时刻*/
        this.missileTime = 0;
        /**射击间隔，毫秒数*/
        this.shootCd = shootCd;
        /**导弹射击间隔，毫秒数*/
        this.missileCd = missileCd;

        var ani = new Animation();
        ani.loadAtlas("res/atlas/shield.json"); // 加载图集动画
        ani.interval = 50;			// 设置播放间隔（单位：毫秒）
        ani.index = 1; 				// 当前播放索引
        ani.play();
        //保护罩
        this.shield = new Sprite();
        this.shield.addChild(ani);
        var bound = this.shield.getBounds();
        this.shield.pivot(bound.width / 2, bound.height / 2);
        this.shield.visible = false;

        /**保护罩的失效时刻*/
        this.shieldTime = 0;

        Player.__super.call(this);
        this.init();
    }

    //主角移动速率
    Player.move_speed = 10;
    //主角攻击间隔，毫秒数
    Player.shoot_cd = 400;
    //主角导弹攻击间隔，毫秒数
    Player.missile_cd = 1000;
    //玩家动作
    //飞
    Player.FLY = "player_run";
    //开火
    Player.FIRE = "player_fire";
    //状态
    Player.HURT = "player_hurt";
    //状态
    Player.DIE = "player_die";

    Player.min_x = 20;
    Player.max_x = Config.GameWidth - 20;
    Player.min_y = 20;
    Player.max_y = Config.GameHeight - 20;

    //Player
    Laya.class(Player, "Player", Sprite);

    var _proto = Player.prototype;

    //是否缓存了
    Player.cached = false;

    _proto.init = function () {
        this.visible = true;

        //动画缓存起来
        if (!Player.cached) {

            Player.cached = true;
            //根据不同的动画 来创建动画模板
            laya.display.Animation.createFrames(['player/palen0.png', 'player/palen1.png',
                'player/palen2.png', 'player/palen3.png'], Player.FLY);
        }

        if (this.body == null) {
            this.body = new laya.display.Animation();
            //this.body.pivot(48, 60);
            this.body.interval = 100;
            this.addChild(this.body);
        }

        this.addChild(this.shield);

        this.start();
        
        //创建一个帧循环处理函数
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    _proto.start = function () {
        this.hp = this.hp_limit;
        this.x = Config.begin_x;
        this.y = Config.begin_y;

        this.shootTime = Browser.now() + this.shootCd;
        this.missileTime = Browser.now() + this.missileCd;

        this.event(Player.HURT, [this.hp, this.hp_limit]);

        //播放动作对应的动画
        this.playAction(Player.FLY);
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
        this.collisionWidth = bound.width / 2;
        this.collisionHeight = bound.height / 2;
        //设置机身的锚点为机身的显示宽高的中心点。
        this.body.pivot(this.collisionWidth, this.collisionHeight);

        /**把范围缩小一点*/
        this.collisionWidth = bound.width / 2 - 20;
        this.collisionHeight = bound.height / 2 - 20;
    }
    _proto.onLoop = function () {
        if(Config.isPause || Config.isOver){
            return;
        }

        //if (this.x != this.nextX) {
        //    var disX = this.speedX;
        //    if (Math.abs(this.x - this.nextX) < Math.abs(disX)) {
        //        this.x = this.nextX;
        //    } else {
        //        this.x += disX;
        //    }
        //}
        //if (this.y != this.nextY) {
        //    var disY = this.speedY;
        //    if (Math.abs(this.y - this.nextY) < Math.abs(disY)) {
        //        this.y = this.nextY;
        //    } else {
        //        this.y += disY;
        //    }
        //}

        this.x += this.speedX;
        if(this.x < Player.min_x){
           this.x = Player.min_x;
        }else if(this.x > Player.max_x){
            this.x = Player.max_x;
        }

        this.y += this.speedY;
        if(this.y < Player.min_y){
            this.y = Player.min_y;
        }else if(this.y > Player.max_y){
            this.y = Player.max_y;
        }

        var currentTime = Browser.now();
        if(this.shootTime <= currentTime){
            this.shootTime = currentTime + this.shootCd;
            this.event(Player.FIRE, [BulletManager.type_player_default]);
        }
        if(this.missileTime <= currentTime){
            this.missileTime = currentTime + this.missileCd;
            this.event(Player.FIRE, [BulletManager.type_player_missile]);
        }

        if(this.shieldTime < currentTime){
            this.shield.visible = false;
        }
    }

    _proto.playerMoveTo = function (toX, toY, speed) {
        var diff_x = toX - this.x;
        var diff_y = toY - this.y;
        if(diff_x == 0){
            diff_x = 1;
        }
        var angle = Math.abs(Math.atan(diff_y / diff_x));
        this.speedX = speed * Math.cos(angle) * (diff_x < 0 ? -1 : 1);
        this.speedY = speed * Math.sin(angle) * (diff_y < 0 ? -1 : 1);
        this.nextX = toX;
        this.nextY = toY;
    }

    _proto.playerMove = function (_speedX, _speedY) {
        this.speedX = _speedX;
        this.speedY = _speedY;
    }

    /**
     * 使用保护罩
     */
    _proto.useShield = function () {
        this.shieldTime = Browser.now() + toolManager.getValue(ToolManager.id_shield);
        this.shield.visible = true;
    }


    /**
     * 与子弹的碰撞
     * @param bullet
     * @param screen
     * @returns {boolean}
     */
    _proto.collisionLogic = function (bullet, screen) {
        if(!this.visible || !bullet.visible){
            return;
        }

        var hadCollide = false;
        var tempX = Math.abs(this.x - bullet.x);
        var tempY = Math.abs(this.y - bullet.y);
        if(tempX <  this.collisionWidth + bullet.collisionWidth
            && tempY < this.collisionHeight + bullet.collisionHeight){
            //碰撞了
            var value = bullet.attack - this.defense;
            if(value <= 0){
                value = 1;//至少打一点血
            }
            this.beHurt(value);
            bullet.hide(true);
            if(this.hp <= 0){//飞机爆炸
                screen.addExplode(this.x, this.y, Explode.PLANE);
            }else{//子弹爆炸
                screen.addExplode(bullet.x, bullet.y, Explode.BULLET);
            }

            hadCollide = true;
        }

        return hadCollide;
    }

    /**
     * 与敌机的碰撞
     * @param enemy
     * @param screen
     * @returns {boolean}
     */
    _proto.collisionLogicEnemy = function (enemy, screen) {
        var hadCollide = false;
        var tempX = Math.abs(this.x - enemy.x);
        var tempY = Math.abs(this.y - enemy.y);
        if(tempX <  this.collisionWidth + enemy.collisionWidth
            && tempY < this.collisionHeight + enemy.collisionHeight){
            //碰撞了
            var value = enemy.attack - this.defense;
            if(value <= 0){
                value = 1;//至少打一点血
            }
            this.beHurt(value);

            //互相伤害
            value = this.attack - enemy.defense;
            if(value <= 0){
                value = 1;//至少打一点血
            }
            enemy.beHurt(value);

            if(this.hp <= 0 || enemy.hp <= 0){//飞机爆炸
                screen.addExplode(this.x, this.y, Explode.PLANE, 10);
            }

            hadCollide = true;
        }

        return hadCollide;
    }

    /**
     * 受伤
     * @param value
     */
    _proto.beHurt = function (value) {
        if(this.shield.visible){//保护罩有效
            return;
        }
        this.hp -= value;
        this.event(Player.HURT, [this.hp, this.hp_limit]);
        this.event(HurtText.create, [this.x, this.y, value]);
        if(this.hp < 0){
            this.hp = 0;
            this.hide();
            SoundManager.playSound(res_sound.sound_explode_plane);
        }
    }

    /**
     * 消失隐藏
     */
    _proto.hide = function () {
        this.visible = false;
        this.event(Player.DIE);
    }

})();