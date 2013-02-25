(function ($) {
    $.fn.customradio = function (method) {

        var options = null;
        var methodName = '';
        var params = [];

        if (arguments.length >= 1 && typeof (arguments[0]) == 'object')
            options = arguments[0];
        else if (arguments.length >= 1 && typeof (arguments[0]) == 'string') {
            methodName = arguments[0];
            params = arguments[1];
        }

        var attr = {
            'target': '',
            'buttons': {
                'true': null,
                'false': null,
                'active': null
            },
            'content': null,
            'onTrue': function(){
                $.noop();
            },
            'onFalse': function(){
                $.noop();
            }
        };

        var methods = {
            init: function (options) {
                var $this = this;

                $this.attr = $.extend(true, {}, attr, options);
                $this.attr.target = $(this);

                methods.build.call($this);
            },

            build: function () {
                var $this = this;

                $this.attr.buttons.true = $this.attr.target.find("[value='true']");
                $this.attr.buttons.false = $this.attr.target.find("[value='false']");

                $this.attr.target.append("<div class='customradio_content'></div>"); 
                $this.attr.content = $this.attr.target.find(".customradio_content");  
                
                $this.attr.content.append($this.attr.buttons.true);
                $this.attr.content.append($this.attr.buttons.false);
                
                $this.attr.content.append("<div class='customradio_button_content'><div class='customradio_button'><div class='areaOn'></div><div class='button_active'></div><div class='areaOff'></div></div></div>");
                $this.attr.buttons.active = $this.attr.target.find(".customradio_button");

                if($this.attr.buttons.true[0].checked)
                    $this.attr.content.addClass('true');
                else
                    $this.attr.content.addClass('false');

                $this.attr.content.click(function(){
                    methods.changeState.call($this);    
                });

                $this.attr.buttons.active.draggable({ 
                    axis: "x",
                    containment: "parent",
                    stop: function(e) {
                        if(parseInt($this.attr.buttons.active.css("left")) < 13) {
                            $this.attr.buttons.active.removeAttr("style");
                            $this.attr.content.removeClass('true').addClass('false');
                            $this.attr.buttons.true.removeAttr('checked');
                            $this.attr.buttons.false.attr('checked', 'checked');
                            $this.attr.onFalse();
                        } else {
                            $this.attr.buttons.active.removeAttr("style");
                            $this.attr.content.removeClass('false').addClass('true');
                            $this.attr.buttons.false.removeAttr('checked');
                            $this.attr.buttons.true.attr('checked', 'checked');    
                            $this.attr.onTrue();    
                        }
                    }
                });

                if($this.attr.target.attr("readonly")){
                    methods.toReadOnly.call($this);
                }
            },

            changeState: function(){
                var $this = this;

                if($this.attr.content.hasClass('true')){
                    $this.attr.content.removeClass('true').addClass('false');
                    $this.attr.buttons.true.removeAttr('checked');
                    $this.attr.buttons.false.attr('checked', 'checked');
                    $this.attr.onFalse();
                } else {
                    $this.attr.content.removeClass('false').addClass('true');
                    $this.attr.buttons.false.removeAttr('checked');
                    $this.attr.buttons.true.attr('checked', 'checked');    
                    $this.attr.onTrue();
                }
            },

            toReadOnly: function(){
                var $this = this;

                $this.attr.content.addClass("readonly");
                $this.attr.content.unbind("click");
                $this.attr.buttons.active.draggable("disable");
            },

            toReadAndWrite: function(){
                var $this = this;

                $this.attr.content.removeClass("readonly");
                $this.attr.target.removeAttr("readonly");
                
                $this.attr.content.click(function(){
                    methods.changeState.call($this);    
                });

                $this.attr.buttons.active.draggable("enable");
            }
        };

        if (methodName != '') {
            if (methods[methodName]) {
                return this.each(function () {
                    methods[methodName].call(this, params);
                });
            }
            else {
                $.error("Method '" + methodName + "' does not exist on jQuery.customradio");
                return;
            }
        }

        return this.each(function () {
            methods.init.call(this, options);
        });
    };
})(jQuery);