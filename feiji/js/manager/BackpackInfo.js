/**
 * 背包
 * Created by Administrator on 2016/9/22.
 */

(function () {
    function BackpackInfo() {
        BackpackInfo.__super.call(this);
    }
    //注册类 BackpackInfo
    Laya.class(BackpackInfo, "BackpackInfo", ui.BackpackUI);
    //获取 BackpackInfo 的原型，用于添加 BackpackInfo 的属性、方法
    var _proto = BackpackInfo.prototype;
})();

var backpackInfo = new BackpackInfo();
