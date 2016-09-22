/**
 * Created by Administrator on 2016/9/13.
 */

(function () {
    /**
     * 游戏入口
     */
    function GameScreen(level) {
        /**背景对象*/
        this.bg = null;
        /**关卡等级*/
        this.level = level;
        /**状态*/
        this.state = 0;
        /**玩家*/
        this.player = null;
        /**敌机集*/
        this.enemys = null;
        /**玩家的子弹集*/
        this.bullet_player = null;
        /**敌人的子弹集*/
        this.bullet_enemy = null;
        /**掉血集*/
        this.hurtTexts = null;
        /**爆炸集*/
        this.explodes = null;
        this.scoreTxt = null;
        this.score = 0;

        /**地图*/
        this.map = null;
        /**地图事件索引*/
        this.mapIndex = 0;

        /**游戏时刻*/
        this.gameTime = 0;
        /**最后刷新时刻*/
        this.lastTime = 0;

        /**震动计数*/
        this.shock = 0;

        /**摇杆*/
        this.rocker = null;
        /***/
        this.gameUi = null;

        GameScreen.__super.call(this);
        this.init();
    }

    /**游戏状态，无*/
    GameScreen.state_none = 0;
    /**游戏状态，加载*/
    GameScreen.state_load = 1;
    /**游戏状态，游戏*/
    GameScreen.state_game = 2;
    /**游戏状态，暂停*/
    GameScreen.state_pause = 3;
    /**游戏状态，胜利*/
    GameScreen.state_win = 4;
    /**游戏状态，失败*/
    GameScreen.state_fail = 5;
    /**游戏状态，退出*/
    GameScreen.state_exit = 6;

    //GameScreen 是一个显示对象 继承此 Sprite
    Laya.class(GameScreen, "GameScreen", laya.display.Sprite);

    //定义GameScreen的prototype
    var _proto = GameScreen.prototype;

    //初始化
    _proto.init = function () {
        this.setState(GameScreen.state_load);

        //背景
        this.bg = new Background(0);
        this.addChild(this.bg);

        //玩家
        this.player = new Player(Player.shoot_cd, Player.missile_cd);
        this.player.on(Player.DIE, this, this.gameOver);
        this.player.on(Player.FIRE, this, this.playerFire);
        this.player.on(Player.HURT, this, this.playerHurt);
        this.player.on(HurtText.create, this, this.createHurtText);
        this.addChild(this.player);

        this.enemys = new Sprite();
        this.addChild(this.enemys);

        this.bullet_enemy = new Sprite();
        this.addChild(this.bullet_enemy);

        this.bullet_player = new Sprite();
        this.addChild(this.bullet_player);

        this.explodes = new Sprite();
        this.addChild(this.explodes);

        this.hurtTexts = new Sprite();
        this.addChild(this.hurtTexts);

        //分数
        this.scoreTxt = new Text();
        this.scoreTxt.color = "#ffffff";
        this.scoreTxt.fontSize = 30;
        this.scoreTxt.text = "0";
        this.scoreTxt.width = Config.GameWidth;
        this.scoreTxt.align = "right";
        this.scoreTxt.x = -10;
        this.scoreTxt.y = 10;
        this.addChild(this.scoreTxt);

        this.gameUi= new ui.GameUI();
        //this.gameUi.button_shield.alpha = 0.9;
        this.gameUi.button_shield.on(laya.events.Event.MOUSE_DOWN, this, this.useTool, [ToolManager.id_shield]);
        this.gameUi.button_skill.on(laya.events.Event.MOUSE_DOWN, this, this.useTool, [ToolManager.index_skill]);
        //this.gameUi.button_shield.mouseThrough = true;
        this.addChild(this.gameUi);

        //var txt = new Label();
        //txt.font = "Microsoft YaHei";
        //txt.color = "#000000";
        //txt.fontSize = 30;
        //txt.text = "文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试文字测试";
        //txt.bold = true;
        //txt.align = "center";
        //txt.y = (Config.GameHeight - txt.height) * 0.5;
        //this.addChild(txt);

        //摇杆要放在最上层
        this.rocker = new Rocker();
        this.addChild(this.rocker);
        //this.rocker.on(laya.events.Event.MOUSE_DOWN, this, this.onRockerDown);
        this.rocker.visible = false;

        //backpackInfo.visible = false;
        //this.addChild(backpackInfo);

        //监听 按下 弹起 事件
        this.on(laya.events.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(laya.events.Event.MOUSE_UP, this, this.onMouseUp);
        //this.mouseThrough = true;
        //Laya.stage.on(laya.events.Event.BLUR,this,this.onBlur);
        //Laya.stage.on(laya.events.Event.FOCUS,this,this.onFocus);

        SoundManager.playMusic(res_sound.music_game);

        this.map = new my.Map();
        this.map.init(this.level, this);
    }

    _proto.onMapLoaded =function () {
        //创建一个帧循环处理函数
        Laya.timer.frameLoop(1, this, this.onLoop);

        this.setState(GameScreen.state_game);
    }

    _proto.reset = function () {
        this.player.start();
        this.enemys.removeChildren(0, this.enemys.numChildren);
        this.bullet_player.removeChildren(0, this.bullet_player.numChildren);
        this.bullet_enemy.removeChildren(0, this.bullet_enemy.numChildren);
        this.explodes.removeChildren(0, this.explodes.numChildren);
        this.hurtTexts.removeChildren(0, this.hurtTexts.numChildren);
    }

    /**
     * 重新挑战本关
     */
    _proto.restart = function () {
        this.reset();
        this.map.restart();
    }

    /**
     * 挑战下一关
     */
    _proto.nextMap = function () {
        this.reset();
        this.level++;
        this.map.init(this.level, this);
    }

    _proto.setState = function (_state) {
        switch (_state){
            case GameScreen.state_game:
                this.shock = 0;
                this.lastTime = Browser.now();//时间刷新
                break;
        }

        this.state = _state;
    }

    _proto.onLoop = function () {
        if(this.shock > 0){
            if(this.shock % 2 == 0){
                this.bg.x = 5;
                this.bg.y = 5;
            }else{
                this.bg.x = -5;
                this.bg.y = -5;
            }
            this.shock--;
            if(this.shock == 0){
                this.bg.x = 0;
                this.bg.y = 0;
            }
        }
        switch (this.state){
            case GameScreen.state_game:
                var currentTime = Browser.now();
                this.gameTime += currentTime - this.lastTime;
                this.lastTime = currentTime;

                //创建敌机
                this.map.checkEvent(this, this.enemys, this.gameTime, this.level);

                //碰撞检测
                var i = 0;
                var j = 0;
                var bullet = null;
                for(i = 0; i < this.bullet_player.numChildren; i++){//主角的子弹与敌机的碰撞
                    for(j = this.enemys.numChildren - 1; j > -1; j--){
                        bullet = this.bullet_player.getChildAt(i);
                        this.enemys.getChildAt(j).collisionLogic(bullet, this);
                        if(!bullet.visible){
                            i--;
                            break;
                        }
                    }
                }

                for(i = 0; i < this.bullet_enemy.numChildren; i++){//主角的子弹与敌机的碰撞
                    if(this.player.collisionLogic(this.bullet_enemy.getChildAt(i), this)){
                        i--;
                    }
                    if(!this.player.visible){//主角死亡了
                        return;
                    }
                }

                for(j = 0; j < this.enemys.numChildren; j++){
                    this.player.collisionLogicEnemy(this.enemys.getChildAt(j), this);
                    if(!this.player.visible){//主角死亡了
                        return;
                    }
                }
                break;
        }
    }

    /**
     * 添加爆炸效果
     * @param _x
     * @param _y
     * @param type
     * @param shock
     */
    _proto.addExplode = function (_x, _y, type, shock) {
        //从对象池里面创建一个子弹
        var explode = Pool.getItemByClass("Explode", Explode);
        //初始化子弹信息
        explode.init( _x, _y, type);
        this.explodes.addChild(explode);

        this.shock += shock;
    }

    //点击玩家移动
    _proto.onMouseDown = function () {
        //this.gameOver();
        //if(this.state == GameScreen.state_game){
        //    var mx = Laya.stage.mouseX;
        //    var my = Laya.stage.mouseY;
        //    this.player.playerMoveTo(mx, my, Player.move_speed);
        //}
        this.rocker.visible = true;
        var mx = Laya.stage.mouseX;
        var my = Laya.stage.mouseY;
        this.rocker.pos(mx - this.rocker.widthHalf, my - this.rocker.heightHalf);
        this.onRockerDown();
    }

    _proto.onMouseUp = function () {
        this.rocker.visible = false;
    }

    _proto.onRockerDown = function(){
        this.rocker.on(Event.MOUSE_MOVE, this, this.onRockerMove);
        this.rocker.on(Event.MOUSE_UP, this, this.onRockerUp);
        this.rocker.on(Event.MOUSE_OUT, this, this.onRockerUp);
        this.rocker.onRockerDown();
        var mx = Laya.stage.mouseX;
        var my = Laya.stage.mouseY;

        this.playerMove(mx, my);
    }

    _proto.onRockerMove = function(){
        var mx = Laya.stage.mouseX;
        var my = Laya.stage.mouseY;
        this.playerMove(mx, my);
    }

    _proto.onRockerUp = function(){
        this.rocker.off(Event.MOUSE_MOVE, this, this.onRockerMove);
        this.rocker.off(Event.MOUSE_UP, this, this.onRockerUp);
        this.rocker.off(Event.MOUSE_OUT, this, this.onRockerUp);
        this.rocker.onRockerUp();
        this.player.playerMove(0, 0);//停止移动
    }

    _proto.playerMove = function (mx, my) {
        var diff_x = mx - this.rocker.x - this.rocker.widthHalf;
        var diff_y = my - this.rocker.y - this.rocker.heightHalf;
        if(diff_x == 0){
            diff_x = 1;
        }
        var tempR = Math.sqrt(diff_x * diff_x + diff_y * diff_y);//点击点距离摇杆中点的距离
        if(tempR > this.rocker.radius){
            tempR = this.rocker.radius;
        }
        var angle = Math.abs(Math.atan(diff_y / diff_x));
        //调整摇杆的方向舵
        this.rocker.onRockerMove(tempR * Math.cos(angle) * (diff_x < 0 ? -1 : 1),
            tempR * Math.sin(angle) * (diff_y < 0 ? -1 : 1));
        //设置玩家移动速度
        var speed = Player.move_speed * tempR / this.rocker.radius;
        var speedX = speed * Math.cos(angle) * (diff_x < 0 ? -1 : 1);
        var speedY = speed * Math.sin(angle) * (diff_y < 0 ? -1 : 1);
        this.player.playerMove(speedX, speedY);
    }

    _proto.onBlur = function () {
        Config.isPause = true;
    }
    _proto.onFocus = function () {
        Config.isPause = false;
    }

    /**
     * 玩家死亡了
     */
    _proto.gameOver = function () {
        Config.isOver = true;
        this.setState(GameScreen.state_fail);
        //hideList("测试公司","赏金宝箱","0.01");
        //var responst = startPayment("10000008","Od123456789","1","","XUTEST16989362","",
        //    "https://www.baodu.com","1001","天使宝宝","测试","测试计费点");
        //console.log(responst.status);
        //if(responst.status == false){
        //    var error = responst.errorMessage;
        //    console.log(error);
        //    if(error == "请传入计费点ID"){
        //
        //    }
        //}
    }

    /**
     * 胜利
     */
    _proto.gameWin = function () {
        this.setState(GameScreen.state_win);
    }

    /**
     * 玩家开火
     */
    _proto.playerFire = function (type) {
        if(this.state != GameScreen.state_game){
            return;
        }

        bulletManager.createBulletPlayer(this, this.bullet_player, this.enemys, type, PlayerData.bullet_level,
            this.player.x + this.player.collisionWidth, this.player.y, this.player.attack);

        if(type == BulletManager.type_player_missile){
            //播放发射子弹音效
            SoundManager.playSound(res_sound.sound_bullet);
        }else{
            //播放发射子弹音效
            SoundManager.playSound(res_sound.sound_bullet);
        }

    }

    /**
     * 玩家受伤
     */
    _proto.playerHurt = function (value, limit) {
        if(value < 0){
            value = 0;
        }else if(value > limit){
            value = limit;
        }

        this.gameUi.hp_bar.scale(value / limit, 1);
    }


    /**
     * 敌人开火
     */
    _proto.enemyFire = function (enemy) {
        if(this.state != GameScreen.state_game){
            return;
        }
        bulletManager.createBulletEnemy(this, this.bullet_enemy, enemy.index, enemy.x - enemy.collisionWidth, enemy.y,
            enemy.attack, this.player.x, this.player.y);
    }

    /**
     * 追踪弹重新找目标
     * @param bullet
     * @param speedY
     */
    _proto.reTrack = function (bullet) {
        //查找目标
        var diff_x = 0;
        var diff_y = 0;
        var track = null;
        var trackX = Config.GameWidth * Config.GameHeight;
        var temp = 0;
        for(var j = 0; j < this.enemys.numChildren; j++){
            var enemy = this.enemys.getChildAt(j);
            diff_x = enemy.x - bullet.x;
            diff_y = enemy.y - bullet.y;
            temp = diff_x * diff_x + diff_y * diff_y;
            if(enemy.visible && enemy.x > bullet.x && temp < trackX){
                trackX = temp;
                track = enemy;
            }
        }
        if(track){
            bullet.setTrack(track);
        }
    }

    /**
     * 使用道具
     * @param toolIndex
     * @param event
     */
    _proto.useTool = function (toolIndex, event) {
        event.stopPropagation();
        switch (toolIndex){
            case ToolManager.id_shield:
                this.player.useShield();
                break;
            case ToolManager.index_skill:
                bulletManager.createBulletPlayer(this, this.bullet_player, this.enemys, BulletManager.type_player_big,
                    PlayerData.bullet_level, this.player.x + this.player.collisionWidth, this.player.y, this.player.attack);
                this.shock += 40;
                break;
        }
    }

    _proto.createHurtText = function (_x, _y, value) {
        //从对象池里面创建
        var hurtText = Pool.getItemByClass("HurtText", HurtText);
        hurtText.init( _x, _y, "-"+value);
        this.hurtTexts.addChild(hurtText);
    }

})();