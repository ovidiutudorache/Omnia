RS.Cache = (function () {
    var getValue = function (key, defaultValue) {
        var value = $.jStorage.get(key, defaultValue);

        return value;
    };

    var setValue = function (key, value) {
        $.jStorage.set(key, value);
    };

    return {
        get: function (key, defaultValue) {
            return getValue(key, defaultValue);
        },
        set: function (key, value) {
            setValue(key, value);
        }
    };
})();