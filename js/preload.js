;(function($){

	function PreLoad(imgs, options) {
		this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
		this.opts = $.extend({}, PreLoad.DEFAULTS, options);

		if(this.opts.order === 'ordered') {
			this._ordered();
		}else {
			this._unordered();
		}
	}

	PreLoad.DEFAULTS = {
		order: 'unordered', //无需预加载
		each: null, //每一张图片加载完毕后执行
		all: null //所有图片加载完毕后执行
	};

	PreLoad.prototype._ordered = function() {
		var opts = this.opts,
				   imgs = this.imgs,
				   len = imgs.length,
				   count = 0;
	    load();

	    //有序预加载
	    function load() {
			var imgObj = new Image();

			$(imgObj).on('load error', function(){
				opts.each && opts.each(count);

				if(count >= len) {
					opts.all && opts.all();
				}else{
					load();
				}
				count++;
			});

			imgObj.src = imgs[count];
		}
	},

	PreLoad.prototype._unordered = function() {   //无序加载
		var imgs = this.imgs,
			opts = this.opts,
			count = 0,
			len = imgs.length;

		$.each(imgs, function(i, src){

			if(typeof src != 'string') return;

			var imgObj = new Image();

			$(imgObj).on('load error', function(){

			    opts.each && opts.each(count);

				if(count >= len -1) {
					opts.all && opts.all();
				}

				return count++;
			});

			return imgObj.src = src;
		});

	};

	/*$.fn.extend -> $('#img').preload()   选择一个元素后再调用
	$.extend -> $.preload();*/   //直接是一个工具函数

	$.extend({
		preload: function(imgs, opts){
			new PreLoad(imgs, opts);
		}
	})

})(jQuery);