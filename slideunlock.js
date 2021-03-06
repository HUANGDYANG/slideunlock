/**
 * jquery plugin -- jquery.slideunlock.js 
  * Version: 1.1.1
  * Author: Dyang
  * Description: 基于slideunlock修改，可在pc和移动端使用
 */
;(function($,window,document,undefined){
    function SliderUnlock(elm,options,success){
        var me = this;
            $elm = me.checkElm(elm)? $(elm) : $;
        success = me.checkFn(success) ? success : function(){};

        var opts = {
            successLabelTip: '验证成功',//返回信息
            duration: 200,//持续的时间
            swipestart: false,//是否开始滑动
            min: 0,//最小值
            max: $elm.width(),//最大值
            index: 0,
            IsOk: false,
            lableIndex: 0
        };

        //继承
        opts = $.extend(opts,options||{});

        //$elm
        me.elm = $elm;
        //opts
        me.opts = opts;
        //是否开始滑动
        me.swipestart = opts.swipestart;
        //最小值
        me.min = opts.min;
        //最大值
        me.max = opts.max;
        //当前滑动条所处的位置
        me.index = opts.index;
        //是否滑动成功
        me.isOk = opts.isOk;
        //滑块宽度
        me.labelWidth = me.elm.find('#label').width();
        //滑块背景
        me.sliderBg = me.elm.find('#slider_bg');
        //鼠标在滑动按钮的位置
        me.lableIndex = opts.lableIndex;
        //success
        me.success = success;
    }

    //操作方法
    SliderUnlock.prototype.init = function () {
        var me = this;

        me.elm.unbind('mousedown');
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');

        me.updateView();
        me.elm.find("#label").on("mousedown", function (event) {
            me.cao = true;

            var e = event || window.event;
            me.lableIndex = e.clientX - this.offsetLeft;
            me.handerIn();

            $(document).on("mousemove", function (event) {
                if(me.cao) {
                    me.handerMove(event);
                }
            }).on("mouseup", function (event) {
                me.handerOutWin();
                me.cao = false
            })
            //     .on("mouseout", function (event) {
            //     me.handerOut();
            // })

        }).on("touchstart", function (event) {
            var e = event || window.event;
            me.lableIndex = e.originalEvent.touches[0].pageX - this.offsetLeft;
            me.handerIn();
        }).on("touchmove", function (event) {
            me.handerMove(event, "mobile");
        }).on("touchend", function (event) {
            me.handerOut();
        })
    };
    /**
     * 鼠标/手指接触滑动按钮
     */
    SliderUnlock.prototype.handerIn = function () {
        var me = this;
        me.swipestart = true;
        me.min = 0;
        me.max = me.elm.width();
    };


    /**
     * 鼠标/手指移出
     */
    SliderUnlock.prototype.handerOut = function () {
        var me = this;
        //停止
        me.swipestart = false;
        //me.move();
        if (me.index < me.max) {
            me.reset();
        }
    };
SliderUnlock.prototype.handerOutWin = function () {
        var me = this;
        //停止
        me.swipestart = false;
        me.move();
        if (me.cao && me.index < me.max) {
            me.reset();
        }
    };

	/**
	 * 鼠标/手指移动
	 * @param event
	 * @param type
	 */
	SliderUnlock.prototype.handerMove = function (event, type) {
		var me = this;
		if (me.swipestart) {
			event.preventDefault();
			event = event || window.event;
			if (type == "mobile") {
				me.index = event.originalEvent.touches[0].pageX - me.lableIndex;
			} else {
				me.index = event.clientX - me.lableIndex;
			}
			me.move();
		}
	};

    /**
     * 鼠标/手指移动过程
     */
    SliderUnlock.prototype.move = function () {
        var me = this;
        if ((me.index + me.labelWidth) >= me.max) {
            me.index = me.max - me.labelWidth -2;
            //停止
            me.swipestart = false;
            //解锁
            me.isOk = true;
        }
        if (me.index < 0) {
            me.index = me.min;
            //未解锁
            me.isOk = false;
        }
        if (me.index+me.labelWidth+2 == me.max && me.max > 0 && me.isOk) {
            //解锁默认操作
            $('#label').unbind().next('#labelTip').
            text(me.opts.successLabelTip).css({'color': '#fff'});
            me.elm.unbind('mousedown');
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            me.success();
        }
        me.updateView();
    };

    /**
     * 更新视图
     */
    SliderUnlock.prototype.updateView = function () {
        var me = this;
        me.sliderBg.css('width', me.index);
        me.elm.find("#label").css("left", me.index + "px")
    };

    /**
     * 重置slide的起点
     */
    SliderUnlock.prototype.reset = function () {
        var me = this;
        me.index = 0;
        me.sliderBg .animate({'width':0},me.opts.duration);
        me.elm.find("#label").animate({left: me.index}, me.opts.duration)
            .next("#lableTip").animate({opacity: 1}, me.opts.duration);
        me.updateView();
    };


    /**
      * 检测元素是否存在
      * @param elm
      * @returns {boolean}
    */
    SliderUnlock.prototype.checkElm = function(elm){
        if($(elm).length > 0){
            return true;
        }else{
            throw "挂载元素不存在"
        }
    }

    /**
     * 检测传入参数是否是function
     * @param fn
     * @returns {boolean}
    */
    SliderUnlock.prototype.checkFn = function(fn){
        if(typeof fn === 'function'){
            return true;
        }else{
            throw 'the param is not a function.'
        }
    };
    window['SliderUnlock'] = SliderUnlock;
    
})(jQuery,window,document);
