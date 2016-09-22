/**
 * 子弹管理
 * Created by Administrator on 2016/9/14.
 */
(function () {
    function BulletManager() {
        this.init();
    }

    //Loading
    Laya.class(BulletManager, "BulletManager");

    /**主角大招输出伤害间隔时间*/
    BulletManager.hurtCd = 50;

    /**子弹类型，无效*/
    BulletManager.type_none = -1;
    /**子弹类型，主角初始子弹*/
    BulletManager.type_player_default = 0;
    /**子弹类型，追踪弹*/
    BulletManager.type_player_missile = 10;
    /**子弹类型，光线大招*/
    BulletManager.type_player_big = 100;

    /**子弹类型，普通*/
    BulletManager.type_enemy_default = 0;
    /**子弹类型，boss*/
    BulletManager.type_enemy_boss = 10;

    /**子弹所属阵营，主角*/
    BulletManager.camp_player = 0;
    /**子弹所属阵营，敌人*/
    BulletManager.camp_enemy = 1;

    /**子弹移动速率，主角*/
    BulletManager.speed_player = 11;
    /**导弹移动速率，主角*/
    BulletManager.speed_player_missile = 20;

    /**子弹移动速率，敌人*/
    BulletManager.speed_enemy = 5;

    var _proto = BulletManager.prototype;

    _proto.init = function () {

    }

    /**
     * 创建主角子弹
     * @param screen
     * @param bullet_player
     * @param enemys
     * @param type
     * @param level
     * @param _x
     * @param _y
     * @param attack
     */
    _proto.createBulletPlayer = function (screen, bullet_player, enemys, type, level, _x, _y, attack) {
        var speedX = BulletManager.speed_player;
        var speedY = 0;
        var bullet = null;
        if(type == BulletManager.type_player_missile) {
            //追踪弹威力翻倍
            attack += attack;

            //从对象池里面创建一个子弹
            bullet = Pool.getItemByClass("Bullet", Bullet);

            //查找目标
            var diff_x = 0;
            var diff_y = 0;
            var track = null;
            var trackX = Config.GameWidth * Config.GameHeight;
            var temp = 0;
            for (var j = 0; j < enemys.numChildren; j++) {
                var enemy = enemys.getChildAt(j);
                diff_x = enemy.x - _x;
                diff_y = enemy.y - _y;
                temp = diff_x * diff_x + diff_y * diff_y;
                if (enemy.visible && enemy.x > _x && temp < trackX) {
                    trackX = temp;
                    track = enemy;
                }
            }
            if (track) {
                bullet.setTrack(track);
            }

            //初始化子弹信息
            bullet.init(screen, _x, _y, BulletManager.camp_player, type, attack, speedX, speedY);

            bullet_player.addChild(bullet);
        }else if(type == BulletManager.type_player_big){
            speedX = 0;
            _x += 500;
            //从对象池里面创建一个子弹
            bullet = Pool.getItemByClass("Bullet", Bullet);
            //初始化子弹信息
            bullet.init(screen, _x, _y, BulletManager.camp_player, type, attack, speedX, speedY);
            bullet_player.addChild(bullet);
        }else{
            var interval = Math.PI / 36;
            var angle = parseInt(level / 2) * interval - (level % 2 == 0 ? interval/2: 0);
            for(var i = 0; i < level; i++){
                //从对象池里面创建一个子弹
                bullet = Pool.getItemByClass("Bullet", Bullet);
                //初始化子弹信息
                bullet.init(screen, _x, _y, BulletManager.camp_player, type, attack, BulletManager.speed_player * Math.cos(angle),
                    BulletManager.speed_player * Math.sin(angle));
                bullet_player.addChild(bullet);

                angle -= interval;
            }

        }
    }

    /**
     * 创建敌人子弹
     * @param screen
     * @param bullet_enemy
     * @param enemyIndex
     * @param _x
     * @param _y
     * @param attack
     */
    _proto.createBulletEnemy = function (screen, bullet_enemy, enemyIndex, _x, _y, attack, trackX, trackY) {
        var bullet = null;
        var type = BulletManager.type_enemy_default;
        var angle = 0;
        if(enemyIndex == EnemyManager.index_line){
            var diff_x = trackX - _x;
            var diff_y = trackY - _y;
            if(diff_x == 0){
                diff_x = 1;
            }
            angle = Math.abs(Math.atan(diff_y / diff_x));
            bullet = Pool.getItemByClass("Bullet", Bullet);
            //初始化子弹信息
            bullet.init(screen, _x, _y, BulletManager.camp_enemy, type, attack,
                BulletManager.speed_enemy * Math.cos(angle) * (diff_x < 0 ? -1 : 1),
                BulletManager.speed_enemy * Math.sin(angle) * (diff_y < 0 ? -1 : 1));
            bullet.rotation = angle * 180 / Math.PI;
            if(diff_x > 0 && diff_y < 0){
                bullet.rotation = -bullet.rotation;
            }else if(diff_x < 0){
                if(diff_y < 0){
                    bullet.rotation = bullet.rotation - 180;
                }else{
                    bullet.rotation = 180 - bullet.rotation;
                }
            }
            bullet_enemy.addChild(bullet);
        }else if(enemyIndex >= EnemyManager.index_boss){
            type = BulletManager.type_enemy_boss;
            var interval = Math.PI / 18;
            var number = 11;
            angle = parseInt(number / 2) * interval - (number % 2 == 0 ? interval/2: 0);
            for(var i = 0; i < number; i++){
                //从对象池里面创建一个子弹
                bullet = Pool.getItemByClass("Bullet", Bullet);
                //初始化子弹信息
                bullet.init(screen, _x, _y, BulletManager.camp_enemy, type, attack, -BulletManager.speed_enemy * Math.cos(angle),
                    BulletManager.speed_enemy * Math.sin(angle));
                bullet_enemy.addChild(bullet);

                angle -= interval;
            }

        }
    }

})();

var bulletManager = new BulletManager();