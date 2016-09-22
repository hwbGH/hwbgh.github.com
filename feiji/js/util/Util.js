/**
 * 常用方法
 * Created by Administrator on 2016/9/14.
 */

/**
 * 获取一个随机整数
 * @param begin 起始（包括）
 * @param end 结束（不包括）
 * @returns {Number}
 */
function getRandomBetweenInt(begin, end){
    try {
        var result = begin;
        if (begin < end) {
            result = begin + (end - begin) * Math.random();
        }
        return parseInt(result);
    } catch (e) {
        return 0;
    }
}

/**
 * 获取一个随机数
 * @param begin 起始（包括）
 * @param end 结束（不包括）
 * @returns {Number}
 */
function getRandomBetween(begin, end){
    try {
        var result = begin;
        if (begin < end) {
            result = begin + (end - begin) * Math.random();
        }
        return result;
    } catch (e) {
        return 0;
    }
}