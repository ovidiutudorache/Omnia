RS.Utils = {
    interceptForm: function (form, beforeSubmitCallback, successCallback) {
        form = form || $("form:first");

        form.ajaxForm({
            beforeSubmit: function (arr, $form, options) {
                if (beforeSubmitCallback)
                    if (!beforeSubmitCallback())
                        return false;

                if (!$form.valid())
                    return false;
            },
            success: function (response) {
                if (successCallback)
                    successCallback(response);
            }
        });
    },
    clearFormValidation: function (form) {
        form = form || $("form:first");

        form.find('.validation-summary-errors ul').empty();
    },
    getQueryString: function (ji) {
        var hu = window.location.search.substring(1);
        var gy = hu.split("&");
        for (var i = 0; i < gy.length; i++) {
            var ft = gy[i].split("=");
            if (ft[0] == ji)
                return ft[1];
        }
    },
    getQueryStringValues: function (url) {
        url = new String(url);

        var queryStringValues = new Object(),
            querystring = url.substring((url.indexOf('?') + 1), url.length),
            querystringSplit = querystring.split('&');

        for (i = 0; i < querystringSplit.length; i++) {
            var pair = querystringSplit[i].split('='),
                name = pair[0],
                value = pair[1];

            queryStringValues[name] = value;
        }

        return queryStringValues;
    },
    getBodyHeight: function () {
        var height, scrollHeight, offsetHeight;
        if (document.height) {
            height = document.height;
        } else if (document.body) {
            if (document.body.scrollHeight)
                height = scrollHeight = document.body.scrollHeight;
            if (document.body.offsetHeight)
                height = offsetHeight = document.body.offsetHeight;
            if (scrollHeight && offsetHeight)
                height = Math.max(scrollHeight, offsetHeight);
        }
        return height;
    },
    getViewPortHeight: function () {
        var height = 0;
        if (window.innerHeight)
            height = window.innerHeight - 18;
        else if ((document.documentElement) && (document.documentElement.clientHeight))
            height = document.documentElement.clientHeight;
        else if ((document.body) && (document.body.clientHeight))
            height = document.body.clientHeight;

        return height;
    },
    isInsideElement: function (pos, el) {
        if (!pos || !el)
            return false;

        var offset = el.offset();
        if (!offset)
            return false;

        var isInside = pos.x >= offset.left && pos.x <= offset.left + el.outerWidth() && pos.y >= offset.top && pos.y <= offset.top + el.outerHeight();

        return isInside;
    },
    getOptionsFromAttributes: function (el, name) {
        if (!el || !name)
            return null;

        var optionsFromAttributes = el.attr(name);
        if (optionsFromAttributes)
            return JSON.parse(optionsFromAttributes);

        return null;
    },
    getBindingFromAttributes: function (element) {
        var text = element.attr('data-bind');
        if (!text)
            return null;

        var binding = {};

        var optionsPos = text.indexOf(',');
        if (optionsPos > -1) {
            binding.Expression = text.substr(0, optionsPos);
            binding.Options = text.length > optionsPos + 1 ? JSON.parse(text.substr(optionsPos + 1)) : null
        }
        else {
            binding.Expression = text;
        }

        return binding;
    },
    getValue: function (model, property) {
        if (!model || !property)
            return null;

        var value = model;

        do {
            var pos = property.indexOf('.');
            if (pos > -1) {
                var prop = property.substr(0, pos);
                value = value[prop];
                if (!value)
                    break;

                property = property.substr(pos + 1);
            }
            else if (property) {
                value = value[property];
            }
        }
        while (pos > -1);

        return value;
    },
    getBoundNames: function (value) {
        if (!value)
            return null;

        var m = value.match(/{{\s*[^{}]+\s*}}/g);
        if (m)
            m = m.map(function (x) {
                if (x && x.length >= 4) {
                    x = x.substr(2);
                    x = x.substr(0, x.length - 2);
                    if (x.indexOf('{') == -1)
                        return x;
                }

                return x.match(/[\w\.]+/)[0];
            });

        return m;
    }
};