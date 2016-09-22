/**
 * 道具管理
 * Created by Administrator on 2016/9/20.
 */
(function () {
    function ToolManager() {
        this.init();
    }

    //Loading
    Laya.class(ToolManager, "ToolManager");

    /**道具编号，无*/
    ToolManager.id_none = 0;
    /**道具编号，保护罩*/
    ToolManager.id_shield = 1;
    /**道具编号，光波大招*/
    ToolManager.index_skill = 2;

    /**最小坐标*/
    ToolManager.min_x = -20;
    /**最大坐标*/
    ToolManager.max_x = Config.GameWidth + 100;
    /**最小坐标*/
    ToolManager.min_y = 30;
    /**最大坐标*/
    ToolManager.max_y = Config.GameHeight - 30;

    /**boss的最终位置*/
    ToolManager.boss_x = Config.GameWidth * 9 / 10;
    /**boss的最终位置*/
    ToolManager.boss_y = Config.GameHeightHalf;

    /**敌机移动速率*/
    ToolManager.speed = 3;

    var _proto = ToolManager.prototype;

    _proto.init = function () {

    }

    _proto.getValue = function (toolId) {
        return 10000;
    }


})();

var toolManager = new ToolManager();