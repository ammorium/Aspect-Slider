(function ($) {
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }
    $.fn.aspectSlider = function (setting) {
        var defaultSetting = {
            indicators: {
                show: false,
                target: '',
                element: '<a href="#" data-id="{0}" class="{1}"></a>',
                activeClass: 'active'
            },
            slide: {
                target: '',
                parent: ''
            },
            play: {
                auto: true,
                time: 3000
            }
        };
        setting = $.extend(true, defaultSetting, setting);
        $slider = $(this);
        var $slides = $slider.find(setting.slide.target);
        var slideCount = $slides.length;
        var $indicators = $(setting.indicators.target);
        var $slideParent = $slider.find(setting.slide.parent);
        var slideWidth = $slideParent.outerWidth();
        var autoPlayTimer;
        var currentSlider;
        if (setting.indicators.show) {
            for (var _s = 1; _s <= slideCount; _s++) {
                var indicator;
                if (_s === 1) {
                    indicator = setting.indicators.element.format(_s, setting.indicators.activeClass);
                } else {
                    indicator = setting.indicators.element.format(_s, '');
                }
                $slides.eq(_s - 1).data('id', _s);
                $indicators.append(indicator);
            }
        }

        $indicators.children().on('click', function (e) {
            e.preventDefault();
            var slideID = $(this).data('id');
            console.log('aspectSlider: indicator click');
            goTo(slideID);
            autoPlay();
        });

        function goTo(id) {
            console.log('aspectSlider: go to ' + id + ' slide');
            currentSlider = id;
            $indicators.children().removeClass(setting.indicators.activeClass);
            $indicators.children().eq(id-1).addClass(setting.indicators.activeClass);
            $slides.each(function () {
                var delta = $(this).data('id') - id;
                var deltaLeft = delta * slideWidth;
                $(this).animate({'left': deltaLeft});
            });
        }
        function autoPlay() {
            window.clearInterval(autoPlayTimer);
            autoPlayTimer = window.setInterval(function() {
                var newSlider;
                if(currentSlider === slideCount) {
                    goTo(1);
                }else{
                    goTo(currentSlider+1);
                }
            }, setting.play.time);
        }
        goTo(1);
        if(setting.play.auto)
            autoPlay();
    };
}(jQuery));