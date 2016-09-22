/**
 * 地图
 * Created by Administrator on 2016/9/22.
 */
(function () {
    function Map() {
        /**地图编号*/
        this.id = 0;
        this.screen = null;
        /**地图内容*/
        this.data = null;
        /**当前内容的索引，地图事件是逐个触发的*/
        this.dataIndex = 0;
        /**记录新的一轮的时刻，当boss出现后地图已经走到了最后，这个时候把索引指向第一个事件*/
        this.newTime = 0;
    }

    Laya.class(Map, "my.Map");

    var _proto = Map.prototype;

    Map.load_over = "map_load_over";

    _proto.init = function (_id, _screen) {
        this.id = _id;
        this.screen = _screen;
        Laya.loader.load("res/map/" + _id + ".txt", Handler.create(this, this.onMapLoaded));
    }

    _proto.restart = function () {
        this.dataIndex = 0;
        this.newTime = 0;
        this.screen.onMapLoaded();
    }

    /**
     * 加载完毕
     * @param _data
     */
    _proto.onMapLoaded = function (_data) {
        //地图结构：[{time:触发时刻,index:敌机编号,number:敌机数量},{},{}]。boss放在最后
        this.data = eval(_data);//把data转成数组
        this.restart();
    }

    /**
     * 检测地图事件
     * @param screen
     * @param enemys
     * @param gameTime
     * @param level
     */
    _proto.checkEvent = function (screen, enemys, gameTime, level) {
        var time = gameTime - this.newTime;
        if(this.dataIndex >= 0 && this.dataIndex < this.data.length && time >= this.data[this.dataIndex].time){
            if(this.newTime > 0 && enemyManager.isBoss(this.data[this.dataIndex].index)){
                //非第一轮，后面如果碰到boss就不再出怪
            }else{
                enemyManager.createEnemy(screen, enemys, this.data[this.dataIndex].index, level,
                    this.data[this.dataIndex].number);
            }

            this.dataIndex++;
        }
        if(this.dataIndex >= this.data.length){
            this.newTime = gameTime;
            this.dataIndex = 0;
        }
    }

})();

