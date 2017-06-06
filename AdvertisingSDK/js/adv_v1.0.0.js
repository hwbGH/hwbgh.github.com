(function (global, doc, factory) {
    factory = factory(global, doc);

    //对外提供的接口
    if (typeof global.define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return factory;
        });
    } else {
        global.mTouch = global.mTouch || factory;
    }

})(window || this, document, function (global, doc) {

    var util = {
        //是否具有touch事件
        hasTouch: !!('ontouchstart' in window),
        /**
         * 判断节点是否是事件代理的目标
         * @param {object} el dom节点对象
         * @param {string} proxyStr 事件委托的选择器
         */
        isProxyTarget: function (el, proxyStr) {
            //class代理
            if (proxyStr.indexOf('.') === 0) {
                return new RegExp('(\\s|^)' + proxyStr.substring(1) + '(\\s|$)').test(el.className);
                //id代理
            } else if (proxyStr.indexOf('#') === 0) {
                return el.id == proxyStr.substring(1);
                //标签代理
            } else {
                return el.tagName.toLocaleLowerCase() == proxyStr;
            }
        },

        /**
         * 获取滑动方向
         * @param {number} x1 滑动开始的x坐标
         * @param {number} y1 滑动开始的y坐标
         * @param {number} x2 滑动结束的x坐标
         * @param {number} y2 滑动结束的y坐标
         */
        swipeDirection: function (x1, y1, x2, y2) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 > x2 ? 'LEFT' : 'RIGHT') : (y1 > y2 ? 'UP' : 'DOWN');
        },

        /**
         * 触发事件，支持事件委托冒泡处理
         * @param {string} eventType 事件类型
         * @param {object} el 绑定了touch事件的dom元素
         * @param {object} event 原生事件对象
         */
        _trigger: function (eventType, el, event) {
            var target = event.target,
                currentTarget = el || event.currentTarget || event.target;

            if (!target || !currentTarget._m_touch_events.hasOwnProperty(eventType)) {
                return;
            }

            var _events = currentTarget._m_touch_events,
                handlerList = _events[eventType];	//事件回调数组

            //开始冒泡循环
            while (1) {
                if (!target) {
                    return;
                }

                //已冒泡至顶，检测是否需要执行回调
                if (target === currentTarget) {
                    //处理（执行）事件回调列表
                    this._execHandler(handlerList, eventType, target, event, true);

                    return;	//已冒泡至顶，无需再冒泡
                }

                //存放临时回调数组
                var tempHandlerList = handlerList;
                // //清空事件回调数组
                // handlerList = [];
                //处理（执行）事件回调列表，并返回未执行的回调列表重新赋值给handlerList继续冒泡
                handlerList = this._execHandler(tempHandlerList, eventType, target, event, false);
                //如果执行结果返回false，则跳出冒泡及后续事件
                if (handlerList === false) {
                    return;
                }

                //向上冒泡
                target = target.parentNode;
            }
        },

        /**
         * 执行事件回调
         * @param {array} handlerList 事件回调列表
         * @param {string} eventType 事件类型
         * @param {object} target 当前目标dom节点
         * @param {object} event 原生事件对象
         * @param {boolean} isBubbleTop 是否冒泡至顶了
         * @return {array} unExecHandlerList 返回不符合执行条件的未执行回调列表
         */
        _execHandler: function (handlerList, eventType, target, event, isBubbleTop) {
            var i, len, handlerObj, proxyStr,
                execList = [], unExecHandlerList = [];

            for (i = 0, len = handlerList.length; i < len; i++) {
                handlerObj = handlerList[i];
                proxyStr = handlerObj.proxyStr;

                //如果冒泡至顶
                if (isBubbleTop) {
                    //将符合执行条件的（没有事件委托）推进执行列表
                    !proxyStr && execList.push(handlerObj);
                    //未冒泡至顶
                } else {
                    //将符合执行条件的（有事件委托且是委托目标）推进执行列表
                    if (proxyStr && this.isProxyTarget(target, proxyStr)) {
                        execList.push(handlerObj);
                    } else {
                        unExecHandlerList.push(handlerObj);
                    }
                }
            }

            var handler;

            if (execList.length) {
                //执行符合条件的回调
                for (i = 0, len = execList.length; i < len; i++) {
                    handler = execList[i].handler;
                    //如果回调执行后返回false，则跳出冒泡及后续事件
                    if (this._callback(eventType, handler, target, event) === false) {
                        return false;
                    }
                }
            }

            return unExecHandlerList;
        },

        /**
         * 事件回调的最终处理函数
         * @param {string} eventType 事件类型
         * @param {function} handler 回调函数
         * @param {object} el 目标dom节点
         * @param {object} event 原生事件对象
         */
        _callback: function (eventType, handler, el, event) {
            var touch = this.hasTouch ? (event.touches.length ? event.touches[0] : event.changedTouches[0]) : event;

            //构建新的事件对象
            var mTouchEvent = {
                'type': eventType,
                'target': event.target,
                'pageX': touch.pageX || 0,
                'pageY': touch.pageY || 0
            };

            //如果是滑动事件则添加初始位置及滑动距离
            if (/^swip/.test(eventType) && event.startPosition) {
                mTouchEvent.startX = event.startPosition.pageX;
                mTouchEvent.startY = event.startPosition.pageY;
                mTouchEvent.moveX = mTouchEvent.pageX - mTouchEvent.startX;
                mTouchEvent.moveY = mTouchEvent.pageY - mTouchEvent.startY;
            }

            //将新的事件对象拓展到原生事件对象里
            event.mTouchEvent = mTouchEvent;

            var result = handler.call(el, event);
            //如果回调执行后返回false，则阻止默认行为和阻止冒泡
            if (result === false) {
                event.preventDefault();
                event.stopPropagation();
            }

            return result;
        }
    };

    //相关控制配置项
    var config = {
        tapMaxDistance: 5,		//单击事件允许的滑动距离
        doubleTapDelay: 200,	//双击事件的延时时长（两次单击的最大时间间隔）
        longTapDelay: 700,		//长按事件的最小时长
        swipeMinDistance: 5,	//触发方向滑动的最小距离
        swipeTime: 300			//触发方向滑动允许的最长时长
    };

    //事件类型列表
    var eventList = {
        TOUCH_START: util.hasTouch ? 'touchstart' : 'mousedown',
        TOUCH_MOVE: util.hasTouch ? 'touchmove' : 'mousemove',
        TOUCH_END: util.hasTouch ? 'touchend' : 'mouseup',
        TOUCH_CANCEL: 'touchcancel',
        TAP: 'tap',
        DOUBLE_TAP: 'doubletap',
        LONG_TAP: 'longtap',
        SWIPE_START: 'swipestart',
        SWIPING: 'swiping',
        SWIPE_END: 'swipeend',
        SWIPE_LEFT: 'swipeleft',
        SWIPE_RIGHT: 'swiperight',
        SWIPE_UP: 'swipeup',
        SWIPE_DOWN: 'swipedown'
    }

    /**
     * touch相关主函数
     * @param {object} el dom节点
     */
    var Mtouch = function (elems) {
        //this._events = {};	//事件集合
        //this.el = el;

        [].forEach.call(elems, function (el, index) {
            //将事件结合保存在dom节点上，以达到共享的目的
            el._m_touch_events = el._m_touch_events || {};
            bindTouchEvents.call(null, el);
            this[index] = el;

        }.bind(this));

        this.length = elems.length;
    };

    Mtouch.prototype = {
        each: function (handler) {
            var i = 0, len = this.length;

            for (; i < len; i++) {
                handler.call(this[i], i);
            }

            return this;
        },
        /**
         * 绑定事件函数，支持事件委托
         * @param {string} eventType 事件类型，可同时绑定多个事件，用空格隔开
         * @param [string] proxyStr 事件委托选择器（可选）
         * @param {function} 事件监听回调函数
         */
        on: function (eventType, proxyStr, handler) {
            //参数预处理
            if (typeof proxyStr === 'function') {
                handler = proxyStr;
                proxyStr = null;
            }
            if (typeof handler !== 'function' || !eventType || !eventType.length) {
                return this;
            }

            //拆分多个事件类型
            var eventTypesArr = eventType.split(/\s+/);

            this.each(function () {
                var _events = this._m_touch_events;

                eventTypesArr.forEach(function (type, key) {
                    //如果未绑定过该事件，则创建一个
                    if (!_events[type]) {
                        _events[type] = [];
                    }

                    _events[type].push({
                        'handler': handler,
                        'proxyStr': proxyStr
                    });
                });
            });

            return this;
        },

        /**
         * 解绑事件
         * @param {string} eventType 事件类型
         * @param {string} proxyStr 事件委托选择器
         */
        off: function (eventType, proxyStr, handler) {
            if (typeof proxyStr === 'function') {
                handler = proxyStr;
                proxyStr = null;
            }

            this.each(function () {
                var _events = this._m_touch_events;

                //没有传事件类型，则解绑所有事件
                if (!eventType) {
                    this._m_touch_events = {};
                    return;
                }

                if (!_events.hasOwnProperty(eventType) || !_events[eventType].length) {
                    return;
                }

                //如果不需解绑代理及特定的回调，直接清空绑定的所有事件
                if (!proxyStr && !handler) {
                    _events[eventType] = [];
                    return;
                }

                var handlerList = _events[eventType],
                    len = handlerList.length - 1,
                    handlerObj;

                //遍历事件数组，删除相应事件
                while (len >= 0) {
                    handlerObj = handlerList[len];

                    if (proxyStr && typeof handler === 'function') {
                        if (handlerObj.proxyStr === proxyStr && handlerObj.handler === handler) {
                            handlerList.splice(len, 1);
                        }
                    } else if (proxyStr && handlerObj.proxyStr === proxyStr) {
                        handlerList.splice(len, 1);

                    } else if (typeof handler === 'function' && handlerObj.handler === handler) {
                        handlerList.splice(len, 1);
                    }

                    len--;
                }
            });

            return this;
        }
    };

    /**
     * 绑定原生touch事件
     * @param {object} el 对应的dom节点
     */
    function bindTouchEvents(el) {
        if (el._m_touch_is_bind) {
            return;
        }

        //触屏开始时间
        var touchStartTime = 0;

        //最后一次触屏时间
        var lastTouchTime = 0;

        //坐标位置
        var x1, x2, x3, x4;

        //单击、长按定时器
        var tapTimer, longTapTimer;

        //记录是否触屏开始
        var isTouchStart = false;

        //重置所有定时器
        var resetTimer = function () {
            clearTimeout(tapTimer);
            clearTimeout(longTapTimer);
        };

        //触发单击事件
        var triggerSingleTap = function (event) {
            isTouchStart = false;
            resetTimer();
            util._trigger(eventList.TAP, el, event);
        };

        //开始触屏监听函数
        var touchstart = function (event) {
            event.stopPropagation();
            var touch = util.hasTouch ? event.touches[0] : event;

            x1 = touch.pageX;
            y1 = touch.pageY;
            x2 = 0;
            y2 = 0;

            isTouchStart = true;
            touchStartTime = +new Date();

            //触发滑动开始事件
            util._trigger(eventList.SWIPE_START, el, event);

            clearTimeout(longTapTimer);
            //设置长按事件定时器
            longTapTimer = setTimeout(function () {
                isTouchStart = false;
                //清楚定时器
                resetTimer();
                util._trigger(eventList.LONG_TAP, el, event);
            }, config.longTapDelay);
        };

        //手指滑动监听函数
        var touchmove = function (event) {
            if (!isTouchStart) {
                return;
            }

            var touch = util.hasTouch ? event.touches[0] : event,
                now = +new Date();

            //记录滑动初始值，为swipe事件传递更多值
            event.startPosition = {
                'pageX': x1,
                'pageY': y1
            };

            //触发滑动中事件
            util._trigger(eventList.SWIPING, el, event);

            x2 = touch.pageX;
            y2 = touch.pageY;

            var distanceX = Math.abs(x1 - x2),
                distanceY = Math.abs(y1 - y2);

            //如果滑动距离超过了单击允许的距离范围，则取消延时事件
            if (distanceX > config.tapMaxDistance || distanceY > config.tapMaxDistance) {
                resetTimer();
            }

            // if (distanceX > config.tapMaxDistance) {
            // 	event.preventDefault();
            // }

        };

        //触屏结束函数
        var touchend = function (event) {
            if (!isTouchStart) {
                return;
            }

            var touch = util.hasTouch ? event.changedTouches[0] : event;

            x2 = touch.pageX;
            y2 = touch.pageY;

            var now = +new Date();

            //触发滑动结束事件
            util._trigger(eventList.SWIPE_END, el, event);

            var distanceX = Math.abs(x1 - x2),
                distanceY = Math.abs(y1 - y2);

            //如果开始跟结束坐标距离在允许范围内则触发单击事件
            if (distanceX <= config.tapMaxDistance && distanceY <= config.tapMaxDistance) {
                //如果没有绑定双击事件，则立即出发单击事件
                if (!el._m_touch_events[eventList.DOUBLE_TAP] || !el._m_touch_events[eventList.DOUBLE_TAP].length) {
                    triggerSingleTap(event);
                    lastTouchTime = now;

                    //如果距离上一次触屏的时长大于双击延时时长，延迟触发单击事件
                } else if (now - lastTouchTime > config.doubleTapDelay) {
                    tapTimer = setTimeout(function () {
                        triggerSingleTap(event);
                    }, config.doubleTapDelay);

                    lastTouchTime = now;

                    //如果距离上一次触屏的时长在双击延时时长内
                    //则清除单击事件计时器，并触发双击事件
                } else {
                    resetTimer();
                    util._trigger(eventList.DOUBLE_TAP, el, event);
                    //双击后重置最后触屏时间为0，是为了从新开始计算下一次双击时长
                    lastTouchTime = 0;
                }
                //触发方向滑动事件
            } else {
                //如果滑动时长在允许的范围内，且滑动距离超过了最小控制阀值，触发方向滑动事件
                if (now - touchStartTime <= config.swipeTime
                    && ( distanceX > config.swipeMinDistance || distanceY > config.swipeMinDistance)
                ) {
                    //滑动方向LEFT, RIGHT, UP, DOWN
                    var direction = util.swipeDirection(x1, y1, x2, y2);

                    resetTimer();

                    util._trigger(eventList['SWIPE_' + direction], el, event);
                }
            }

            isTouchStart = false;
        };

        //绑定触屏开始事件
        el.addEventListener(eventList.TOUCH_START, touchstart);
        //绑定触屏滑动事件
        el.addEventListener(eventList.TOUCH_MOVE, touchmove);
        //绑定触屏结束事件
        el.addEventListener(eventList.TOUCH_END, touchend);
        //绑定触屏取消事件
        el.addEventListener(eventList.TOUCH_CANCEL, resetTimer);

        el._m_touch_is_bind = true;	//标记该节点已经绑定过touch事件了
    }


    /**
     * 返回的辅助函数
     * @param {string} selector 选择器字符串
     */
    var mTouch = function (selector) {
        var elems;
        if (selector === doc || selector.nodeType === 1) {
            elems = [selector];
        } else {
            elems = doc.querySelectorAll(selector);
        }

        return new Mtouch(elems);
    };
    //配置touch事件相关控制的接口
    mTouch.config = function (cfg) {
        for (var k in cfg) {
            if (cfg.hasOwnProperty(k)) {
                config[k] = cfg[k];
            }
        }
    };

    return mTouch;
});

var Advertising = {
    baseRandom: (Math.random() + "").replace(".", ""),
    baseZIndex: 999,
    iframeZIndex: 9999,

    // div的ID
    adv_banner_id: '_adv_banner',
    /**横幅*/
    div_banner: null,
    bannerWidth: 100,
    bannerHeight: 100,

    // div的ID
    adv_rotation_id: '_adv_rotation',
    /**轮播*/
    div_rotation: null,
    rotationWidth: 100,
    rotationHeight: 240,

    div_pop: null,
    adv_iframe_id: "_adv_iframe",
    iframe_back_btn_id: "_adv_iframe_back",

    // div的ID
    adv_video_div_id: '_video_div',
    // 承载Video的div，便于显示在所有元素的顶端
    div_video: null,
    // Video标签ID
    adv_video_id: '_advertisingVideo',
    // Video标签元素
    myVideo: null,
    // 播放视频的起始时刻
    playTime: new Date().getTime(),
    top: 0,
    left: 0,
    width: 200,
    height: 100,

    init: function (_top, _left, _width, _height) {
        this.adv_banner_id = "_adv_banner" + this.baseRandom;
        this.adv_video_div_id = '_video_div' + this.baseRandom;
        this.adv_video_id = '_advertisingVideo' + this.baseRandom;
        this.adv_iframe_id = "_adv_iframe" + this.baseRandom;
        this.iframe_back_btn_id = "_adv_iframe_back" + this.baseRandom;
        this.adv_rotation_id = '_adv_rotation' + this.baseRandom;

        this.top = _top;
        this.left = _left;

        if (_width > this.width) {
            this.width = _width;
        }
        if (_height > this.height) {
            this.height = _height;
        }

        //this.myVideo = videojs("videoId");

        this.bannerWidth = window.screen.width;

        this.rotationWidth = window.screen.width;

        if (!this.div_video) {
            this.createPop();
        }

        //this.eventVideo("play");
        //this.eventVideo("ended");
        this.onLoop();
    },

    onLoop: function () {

        setTimeout(Advertising.onLoop, 500);
    },

    /**
     * 创建DIV置于顶层
     */
    createPop: function () {
        if (this.div_video) {
            return;
        }
        var indexCount = 1;
        this.div_banner = document.createElement('div');
        this.div_banner.id = this.adv_banner_id;
        this.div_banner.style.width = this.bannerWidth + "px";//this.width + "px";//'100%';
        this.div_banner.style.height = this.bannerHeight + "px";//this.height + "px";//'100%';
        this.div_banner.style.position = 'fixed';
        this.div_banner.style.zIndex = this.baseZIndex;
        this.div_banner.style.overflow = 'hidden';
        this.div_banner.style.left = "0px";
        this.div_banner.style.bottom = "0px";
        this.div_banner.style.backgroundColor = "#000000";
        this.div_banner.style.display = "block";
        document.getElementsByTagName('body').item(0).appendChild(this.div_banner);

        this.div_rotation = document.createElement('div');
        this.div_rotation.id = this.adv_rotation_id;
        this.div_rotation.style.width = this.rotationWidth + "px";//this.width + "px";//'100%';
        this.div_rotation.style.height = this.rotationHeight + "px";//this.height + "px";//'100%';
        this.div_rotation.style.position = 'fixed';
        this.div_rotation.style.zIndex = this.baseZIndex + (indexCount++);
        //this.div_rotation.style.overflow = 'scroll';
        this.div_rotation.style.left = "0px";
        this.div_rotation.style.top = (window.screen.height - this.rotationHeight) / 2 + "px";
        this.div_rotation.style.backgroundColor = "#000000";
        this.div_rotation.style.display = "inline-block";
        document.getElementsByTagName('body').item(0).appendChild(this.div_rotation);

        this.div_video = document.createElement('div');
        this.div_video.id = this.adv_video_div_id;
        this.div_video.style.width = '100%';//this.width + "px";//'100%';
        this.div_video.style.height = '100%';//this.height + "px";//'100%';
        this.div_video.style.position = 'fixed';
        this.div_video.style.zIndex = this.baseZIndex + (indexCount++);
        this.div_video.style.overflow = 'hidden';
        this.div_video.style.left = this.left + "px";
        this.div_video.style.top = this.top + "px";
        this.div_video.style.backgroundColor = "#000000";
        this.div_video.style.display = "none";
        this.div_video.onclick = this.clickAdvVideo;
        document.getElementsByTagName('body').item(0).appendChild(this.div_video);

        try {
            this.div_video.style["-webkit-overflow-scrolling"] = "touch";
            this.div_video.style["overflow-y"] = "scroll";
            if (this.width < this.height) {
                //this.div_video.style["transform"] = "90deg";
                //this.div_video.style["-ms-transform"] = "90deg";
                //this.div_video.style["-webkit-transform"] = "90deg";
            }

            this.div_banner.style["text-align"] = "left";
            this.div_banner.style["-webkit-transform-style"] = "preserve-3d";
            this.div_banner.style["-moz-transform-style"] = "preserve-3d";
            this.div_banner.style["-ms-transform-style"] = "preserve-3d";
            this.div_banner.style["transform-style"] = "preserve-3d";
            this.div_banner.style["-webkit-flex-shrink"] = "0";
            this.div_banner.style["-ms-flex"] = "0 0 auto";
            this.div_banner.style["flex-shrink"] = "0";

            this.div_rotation.style["text-align"] = "left";
            this.div_rotation.style["-webkit-transform-style"] = "preserve-3d";
            this.div_rotation.style["-moz-transform-style"] = "preserve-3d";
            this.div_rotation.style["-ms-transform-style"] = "preserve-3d";
            this.div_rotation.style["transform-style"] = "preserve-3d";
            this.div_rotation.style["-webkit-flex-shrink"] = "0";
            this.div_rotation.style["-ms-flex"] = "0 0 auto";
            this.div_rotation.style["flex-shrink"] = "0";
            this.div_rotation.style["overflow-y"] = "hidden";
            this.div_rotation.style["overflow-x"] = "scroll";

        } catch (e) {
        }

        this.createVideo();
        this.initBanner();
        this.initRotation();
    },

    /**
     * 创建Video标签
     */
    createVideo: function () {
        this.myVideo = document.createElement("VIDEO");
        this.myVideo.id = this.adv_video_id;
        this.myVideo.autoplay = true;
        //this.myVideo.controls = "controls";
        //object-fit:fill | contain | cover | none | scale-down
        this.myVideo.style = "width:100%;height:100%;object-fit:contain;";

        //this.myVideo.poster = "images/1.jpg";//视频还未播放时显示的视频封面
        //this.myVideo.webkit-playsinline = "true";//这个属性是ios 10中设置可以让视频在小窗内播放，也就是不是全屏播放
        //this.myVideo.playsinline = "true";//IOS微信浏览器支持小窗内播放
        //this.myVideo.x-webkit-airplay = "allow";
        //this.myVideo.x5-video-player-type = "h5";//启用H5播放器,是wechat安卓版特性
        //this.myVideo.x5-video-player-fullscreen = "true";//全屏设置，设置为 true 是防止横屏
        //this.myVideo.x5-video-orientation = "portraint";//播放器支付的方向，landscape横屏，portraint竖屏，默认值为竖屏

        this.div_video.appendChild(this.myVideo);
    },

    /**
     * 创建iframe
     */
    createIframe: function (ifrmSrc) {
        var oScript = document.createElement("iframe");
        oScript.id = this.adv_iframe_id;
        oScript.style.zIndex = this.iframeZIndex;
        oScript.style.backgroundColor = '#fff';
        oScript.style.position = 'fixed';
        oScript.style.left = "0px";
        oScript.style.bottom = "0px";
        oScript.frameBorder = '0';
        oScript.width = "100%";
        oScript.height = '100%';
        oScript.src = ifrmSrc;
        document.getElementsByTagName('body').item(0).appendChild(oScript);

        var btn = document.createElement('div');
        btn.id = this.iframe_back_btn_id;
        btn.style.width = "152px";
        btn.style.height = "40px";
        btn.style.transition = 'all 0.5s';
        btn.style.left = '-10px';
        btn.style.top = '-1px';
        btn.style.display = 'block';
        btn.style.position = 'absolute';
        btn.style.zIndex = this.iframeZIndex + 1;
        btn.innerHTML = '<img width="100%" height="100%" src="res/btn_back.png" />';
        //btn.onclick = this.closeIframe;
        document.getElementsByTagName('body').item(0).appendChild(btn);

        //添加点击事件
        mTouch('#'+this.iframe_back_btn_id).on('tap',  function () {
            Advertising.closeIframe();
        });

        //悬浮球
        var assistiveLeft, assistiveRight, timerid;
        var stickEdge = function (el) {
            var left = parseInt(el.style.left) || 0,
                width = parseInt(el.offsetWidth) || 0,
                windowWith = (document.documentElement || document.body).offsetWidth;
            if (left > (windowWith - width) / 2) {
                left = windowWith - width + 10;
            } else {
                left = -10;
            }
            el.style.transition = 'all .2s';
            el.style['transition'] = 'all .2s';
            el.style.left = left + 'px';
            timerid = setTimeout(function () {
                el.style.transition = 'all .5s';
                el.style['transition'] = 'all .5s';

            }, 2000);
        };

        mTouch('#'+this.iframe_back_btn_id).on('swipestart', function (e) {
            clearTimeout(timerid);
            e.stopPropagation();
            this.style.transition = 'none';
            this.style['transition'] = 'none';
            assistiveLeft = parseInt(this.style.left) || 0;
            assistiveTop = parseInt(this.style.top) || 0;
            return false;
        }).on('swiping', function (e) {
            e.stopPropagation();
            this.style.left = assistiveLeft + e.mTouchEvent.moveX + 'px';
            this.style.top = assistiveTop + e.mTouchEvent.moveY + 'px';
        }).on('swipeend', function () {
            stickEdge(this);
        });


        var control = navigator.control || {};
        if (control.gesture) {
            control.gesture(false);
        }


    },

    /**
     * 关闭
     */
    closeIframe: function () {
        Advertising.removeElement(Advertising.getElement(Advertising.adv_iframe_id));
        Advertising.removeElement(Advertising.getElement(Advertising.iframe_back_btn_id));
        console.log("back to game");
    },

    /**
     * 初始化banner的内容
     */
    initBanner: function () {
        //this.div_banner.style.width = this.bannerWidth * 3 + "px";
        var url0 = "https://www.baidu.com/index.php";
        var url1 = "http://www.layabox.com/";
        this.div_banner.innerHTML =
            '<img style="max-width: 640px;" width="100%" height="100%" src="res/102084_banner_640240.jpg" onclick="Advertising.clickAdvBanner(\'' + url0 +
            '\');"/>';
    },

    initRotation: function () {

        //this.div_rotation.style.width = this.rotationWidth * number + "px";
        //this.div_rotation.innerHTML =
        //    '<img width="100%" height="100%" src="res/102084_banner_640240.jpg" onclick="Advertising.clickAdvBanner(\'' + url0 +
        //    '\');"/>' +
        //    '<img width="100%" height="100%" src="res/163_banner_640240.jpg" onclick="Advertising.clickAdvBanner(\'' + url1 +
        //    '\');"/>';

        var urls = [{img: "res/102084_banner_640240.jpg", url: "https://www.baidu.com/index.php"},
            {img: "res/163_banner_640240.jpg", url: "http://www.layabox.com/"}];
        var number = urls.length;
        var divHtml = '<div style="width:' + (this.rotationWidth * number) + 'px;height:100%">';
        for (var i = 0; i < number; i++) {
            divHtml += '<div style="width:' + this.rotationWidth + 'px;height: 100%;float:left;"><img ' +
                'src="' + urls[i].img + '" onclick="Advertising.clickAdvBanner(\'' + urls[i].url + '\');"/></div>';
        }
        divHtml += '</div>';

        this.div_rotation.innerHTML = divHtml;
    },

    // 根据id获取元素
    getElement: function (id) {
        return document.getElementById(id);
    },

    /**
     * 关闭视频界面
     */
    closeVideo: function () {
        if (Advertising.myVideo) {
            Advertising.myVideo.pause();
        }

        this.exitFullScreen();
        //this.removeElement(this.div_video);
        this.div_video.style.display = "none";
    },

    /**
     * 移除元素
     * @param _element
     */
    removeElement: function (_element) {
        if (_element == null || _element == undefined
            || _element == "undefined")
            return;
        var _parentElement = _element.parentNode;
        if (_parentElement) {
            _parentElement.removeChild(_element);
        }
    },

    //进入全屏
    launchFullScreen: function (element) {
        //此方法不可以在異步任務中執行，否則火狐無法全屏
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.oRequestFullscreen) {
            element.oRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullScreen();
        } else {
            var docHtml = document.documentElement;
            var docBody = document.body;
            var cssText = 'width:100%;height:100%;overflow:hidden;';
            docHtml.style.cssText = cssText;
            docBody.style.cssText = cssText;
            this.div_video.style.cssText = cssText + ';' + 'margin:0px;padding:0px;';
            document.IsFullScreen = true;
        }
    },

    //退出全屏
    exitFullScreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.oRequestFullscreen) {
            document.oCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            //document.webkitCancelFullScreen();
        } else if (document.IsFullScreen) {
            var docHtml = document.documentElement;
            var docBody = document.body;
            docHtml.style.cssText = "";
            docBody.style.cssText = "";
            this.div_video.style.cssText = "";
            document.IsFullScreen = false;
        }
    },

    play: function (_url) {
        if (!this.div_video) {
            this.createPop();
        }
        this.div_video.style.display = "block";

        if (this.myVideo) {
            this.myVideo.src = _url;
            this.myVideo.play();
        }
        this.playTime = new Date().getTime();

        if (this.width >= this.height) {
            //如果是横屏，则进入全屏
            //this.launchFullScreen(this.myVideo);
        }

        this.playOver();
    },

    clickAdvVideo: function () {
        window.open("https://www.baidu.com/index.php");
        Advertising.closeVideo();
    },

    clickAdvBanner: function (_url) {
        this.createIframe(_url);
        //window.open(_url);
    },

    eventVideo: function (e) {
        this.myVideo.addEventListener(e, function () {
            console.log((new Date()).getTime(), e);
        }, false);
    },

    playOver: function () {
        var passTime = new Date().getTime() - Advertising.playTime;//已经过去多少毫秒
        if (Advertising.myVideo) {
            if (Advertising.myVideo.ended || (Advertising.myVideo.duration > 0 && passTime >= Advertising.myVideo.duration * 1000)) {
                //播放结束
                Advertising.closeVideo();
                return;
            } else {

            }
        }

        if (passTime > 30000) {
            //超过了30秒，直接结束
            Advertising.closeVideo();
            return;
        }

        setTimeout(Advertising.playOver, 500);
    }
};
Advertising.init(0, 0, window.screen.width, window.screen.height);
