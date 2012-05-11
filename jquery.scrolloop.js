/* jquery.scrolloop.js -- looping jQuery scrolloop
  version 0.9, May 10, 2012

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

var jQuery;
(function ($) {
    var methods = {
        init: function (speed) {

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
                        multiplier: speed || 10
                    });
                    data = $this.data("scrolloop");
                }

                $(this).css({
                    'overflow': "hidden",
                    'position': "relative"
                }).find("li").each(function () {
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

                $(this).height(maxheight);

                $this.mousemove(function (e) {
                    // set movement speed depending on mouse position relative to the scrolloop
                    var w = $this.outerWidth(),
                        d = (e.pageX - ($this.offset().left + w / 2)) * 2 / w;

                    data.d = d;

                }).mouseenter(function () {

                    // clear movement interval and timeout
                    if (data.interval) {
                        clearInterval(data.interval);
                        data.interval = null;
                        clearTimeout(data.timeout);
                        data.timeout = null;
                    }

                    // move
                    data.interval = setInterval(function () {
                        methods.scroll.apply($this);
                    }, 50);

                }).mouseleave(function () {
                    // speed down
                    data.d /= 2;

                    // and set timeout to stop movement
                    data.timeout = setTimeout(function () {
                        if (data.interval) {
                            clearInterval(data.interval);
                            data.interval = null;
                        }
                    }, 300);
                });
            });
        },

        // scrolls all the images
        scroll: function () {

            var data = $(this).data("scrolloop"),
                i,
                n,
                totalwidth,
                speed = -data.d * data.multiplier;

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
                }
            }

            return $(this);
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
