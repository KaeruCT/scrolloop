/* jquery.scrolloop.js -- looping jQuery scroller
  version 1.0, May 27, 2012

  Copyright (C) 2012 KaeruCT

  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.

  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:

  1. The origin of this software must not be misrepresented; you must not
     claim that you wrote the original software. If you use this software
     in a product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original software.
  3. This notice may not be removed or altered from any source distribution.

  KaeruCT keroct@gmail.com

*/
/*global jQuery */
(function ($) {
    var methods = {
        'init': function (speed) {

            return this.each(function () {

                var $this = $(this),
                    width,
                    maxheight = 0,
                    i,
                    n,
                    img = $this.children("li"),
                    data = $this.data("scrolloop");

                // saving some data in the dom element
                if (!data) {
                    $this.data("scrolloop", {
                        img: img,
                        pos: [img.length],
                        d: 0,
                        interval: null,
                        timeout: null,
                        stopping: false,
                        multiplier: speed || 7
                    });
                    data = $this.data("scrolloop");
                }

                $this.css({
                    'overflow': "hidden",
                    'position': "relative"
                }).show();

                img.each(function () {
                    $(this).css({
                        'position': "absolute",
                        'top': "50%",
                        'margin-top': "-" + ($(this).height() / 2) + "px"
                    });
                });

                for (i = 0; i < img.length; i += 1) {

                    width = 0;
                    if ($(img[n]).outerHeight() > maxheight) {
                        maxheight = $(img[n]).outerHeight();
                    }

                    for (n = 0; n < i; n += 1) {
                        width += $(img[n]).outerWidth(true);
                    }

                    data.pos[i] = width;

                    $(img[i]).css({
                        'left': width
                    });
                }

                $this.height(maxheight).hide();

                // binding events
                $this.mousemove(function (e) {
                    methods.move.apply(this, [e]);
                }).mouseenter(function (e) {
                    methods.startscroll.apply(this, [e]);
                }).mouseleave(function (e) {
                    methods.endscroll.apply(this, [e]);
                });
            });
        },

        // scrolls all the images
        'scroll': function () {
            var data = $(this).data("scrolloop"),
                i,
                n,
                totalwidth,
                speed = -data.d,

                toggle_offscreen = function (i) {
                    // hide the image if it's not visible, show otherwise
                    // safari mac has a weird webkit bug that makes this necessary

                    var img = $(data.img[i]);

                    if (data.arrleft[i] < -img.outerWidth() ||
                            data.arrleft[i] > $(this).outerWidth() + img.outerWidth()) {

                        img.hide();
                    } else {

                        img.show();
                    }
                };

            speed *= data.multiplier;

            if (data.stopping) {
                // speed down
                data.d /= 1.1;
            }

            if (speed < 0) {

                for (i = 0; i < data.img.length; i += 1) {
                    data.pos[i] += speed;

                    if (data.pos[i] <= -$(data.img[i]).outerWidth()) {

                        totalwidth = 0;

                        for (n = 0; n < data.img.length; n += 1) {
                            if (n !== i) {
                                totalwidth += $(data.img[n]).outerWidth();
                            }
                        }

                        data.pos[i] = totalwidth + data.pos[i] + $(data.img[i]).outerWidth();
                    }
                    $(data.img[i]).css("left", data.pos[i]);
                    toggle_offscreen(i);
                }
            } else {

                for (i = data.img.length - 1; i > -1; i -= 1) {
                    data.pos[i] += speed;

                    if (data.pos[i] >= $(this).outerWidth()) {

                        totalwidth = 0;

                        for (n = 0; n < data.img.length; n += 1) {
                            totalwidth += $(data.img[n]).outerWidth();
                        }

                        data.pos[i] -= totalwidth;
                    }
                    $(data.img[i]).css("left", data.pos[i]);
                    toggle_offscreen(i);
                }
            }

            return $(this);
        },

        // function to execute on mousemove
        'move': function (e) {
            var $this = $(this),
                w,
                data = $this.data("scrolloop");

            // speed is distance between cursor and center of element
            w = $this.outerWidth();
            data.d = (e.pageX - ($this.offset().left + w / 2)) * 2 / w;
        },

        // begin scrolling
        'startscroll': function (e) {
            var $this = $(this),
                data = $this.data("scrolloop");

            // clear movement interval and timeout
            if (data.interval !== null) {
                clearInterval(data.interval);
                data.interval = null;
                clearTimeout(data.timeout);
                data.timeout = null;
            }

            data.stopping = false;
            data.fevent = e;

            // move
            data.interval = setInterval(function () {
                methods.scroll.apply($this);
            }, 50);
        },

        // stop scrolling
        'endscroll': function () {
            var $this = $(this),
                data = $this.data("scrolloop");

            data.stopping = true;

            // and set timeout to stop movement
            data.timeout = setTimeout(function () {
                if (data.interval !== null) {
                    clearInterval(data.interval);
                    data.interval = null;
                }
                data.stopping = false;
            }, 500);
        }
    };

    // jQuery plugin implementation
    $.fn.scrolloop = function (f) {
        if (methods[f]) {
            return methods[f].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof f === 'number' || !f) {
            return methods.init.apply(this, arguments);
        }

        $.error('Method ' + f + ' does not exist on jQuery.scrolloop');

    };
}(jQuery));
