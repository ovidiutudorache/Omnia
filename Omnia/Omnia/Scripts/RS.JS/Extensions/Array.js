Array.prototype.findFirstIndex = function (validateFunction) {
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (validateFunction(item, i))
            return i;
    }

    return -1;
};

Array.prototype.findFirst = function (validateFunction) {
    var index = this.findFirstIndex(validateFunction);

    return index >= 0 ? this[index] : null;
};

Array.prototype.findFirstKeyValue = function (key, value) {
    if (!key)
        return null;

    return this.findFirst(function (item, index) { return item && item[key] == value; });
};

Array.prototype.findFirstKeyIndex = function (key, value) {
    if (!key)
        return null;

    return this.findFirstIndex(function (item, index) { return item && item[key] == value; });
};