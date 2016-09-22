/**
 * 敌机管理
 * Created by Administrator on 2016/9/14.
 */
(function () {
    function EnemyManager() {
        this.init();
    }

    //Loading
    Laya.class(EnemyManager, "EnemyManager");

    /**敌人编号，直线行走的敌人*/
    EnemyManager.index_line = 0;
    /**敌人编号，曲线行走的敌人*/
    EnemyManager.index_tween = 1;
    /**敌人编号，boss*/
    EnemyManager.index_boss = 100;

    /**最小坐标*/
    EnemyManager.min_x = -20;
    /**最大坐标*/
    EnemyManager.max_x = Config.GameWidth + 100;
    /**最小坐标*/
    EnemyManager.min_y = 30;
    /**最大坐标*/
    EnemyManager.max_y = Config.GameHeight - 30;

    /**boss的最终位置*/
    EnemyManager.boss_x = Config.GameWidth * 9 / 10;
    /**boss的最终位置*/
    EnemyManager.boss_y = Config.GameHeightHalf;

    /**敌机移动速率*/
    EnemyManager.speed = 3;

    var _proto = EnemyManager.prototype;

    _proto.init = function () {

    }

    /**
     * 创建敌机
     * @param screen
     * @param enemys
     * @param index
     * @param level
     * @param number
     */
    _proto.createEnemy = function (screen, enemys, index, level, number) {
        var _x = EnemyManager.max_x;
        var _y = getRandomBetweenInt(0, Config.GameHeight);

        var hp = 10 + level * 10;
        var attack = 5 + level * 3;
        var defense = 1 + level;
        var shootCd = 99999999;//设置超长，等于不能射击
        var speedX = -EnemyManager.speed;
        var speedY = 0;
        if(index == EnemyManager.index_line){
            shootCd = 1500;
            speedX = -EnemyManager.speed;
        }else if(index == EnemyManager.index_tween){
            _y = getRandomBetweenInt(Config.GameHeightHalf / 3, Config.GameHeight - Config.GameHeightHalf / 3);

            speedX = -EnemyManager.speed;
            if(_y < Config.GameHeightHalf){
                speedY = EnemyManager.speed;
            }else{
                speedY = -EnemyManager.speed;
            }
        }else if(index >= EnemyManager.index_boss){
            hp = 1000 + level * 100;
            attack = 10 + level * 7;
            defense = 3 + level * 3;
            shootCd = 3000 - level * 20;
            if(shootCd < 1000){
                shootCd = 1000;
            }
            speedX = -EnemyManager.speed;
            _y = EnemyManager.boss_y;
        }

        var enemy =null;
        var interval = 1;
        if(_y > Config.GameHeightHalf){
            interval = -1;
        }
        for(var i = 0; i < number; i++){
            //从对象池里面创建一个子弹
            enemy = Pool.getItemByClass("Enemy", Enemy);
            //初始化子弹信息
            enemy.init(index, _x, _y, hp, attack, defense, shootCd, speedX, speedY);
            enemy.on(Enemy.FIRE, screen, screen.enemyFire);
            enemy.on(HurtText.create, screen, screen.createHurtText);
            enemy.on(Enemy.DIE, screen, screen.gameWin);
            enemys.addChild(enemy);
            switch (index){
                case EnemyManager.index_line:
                    _y += (enemy.boundHeight + 5) * interval;
                    break;
                case EnemyManager.index_tween:
                    _x += enemy.boundWidth + 5;
                    break;
            }
        }

    }

    /**
     * 该角色是否是boss
     * @param index
     * @returns {boolean}
     */
    _proto.isBoss = function (index) {
        if(index >= EnemyManager.index_boss){
            return true;
        }else{
            return false;
        }
    }

})();

var enemyManager = new EnemyManager();