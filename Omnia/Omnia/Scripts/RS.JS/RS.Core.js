RS.Core = RS.Core || {};

RS.Core.copy = function (o, deep) {
    return deep ? jQuery.extend(true, {}, o) : jQuery.extend({}, o);
};

function extend(subClass, superClass) {
    var f = function () { };
    f.prototype = superClass.prototype;
    subClass.prototype = new f();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor)
        superClass.prototype.constructor = superClass;
};

var override = function (f, newCode) {
    if (!f)
        return null;

    if (!newCode)
        return f;

    var proxied = f;

    f = function () {
        proxied.apply(this, arguments);

        return newCode.apply(this, arguments);
    };

    return f;
};