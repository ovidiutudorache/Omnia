(function (jQuery) {
    jQuery.fn.extend({
        getControl: function () {
            return this.data('control');
        },
        enable: function () {
            return this.prop('disabled', false);
        },
        disable: function () {
            return this.prop('disabled', true);
        },
        check: function () {
            return this.prop('checked', true);
        },
        uncheck: function () {
            return this.prop('checked', false);
        },
        attrs: function (startsWith) {
            var t = $(this);
            var a = [],
                r = t.get(0);
            if (r) {
                r = r.attributes;
                for (var i in r) {
                    var p = r[i];
                    if (typeof p.nodeValue !== 'undefined') {
                        if (startsWith && p.nodeName.indexOf(startsWith) == -1)
                            continue;

                        a.push({
                            Name: p.nodeName,
                            Value: p.nodeValue
                        });
                    }
                }
            }
            return a;
        }
    });
})(jQuery);