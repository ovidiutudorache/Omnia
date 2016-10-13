String.prototype.parseDate = function () {
    if (this.toString().indexOf('Date') >= 0)
        return new Date(parseInt(this.replace("/Date(", "").replace(")/", ""), 10));

    return new Date(this);
};

String.prototype.removeNonAlphaNumeric = function (removeSpaces) {
    var i = 0;
    var string = (typeof (this) == "function" && !(i++)) ? arguments[0] : this;

    var pattern = removeSpaces ? /[^a-zA-Z0-9]/g : /[^a-zA-Z0-9 ]/g;

    string = string.replace(pattern, '');

    return string;
};

String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
};

String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str;
};

String.prototype.endsWith = function (str) {
    return this.slice(-str.length) == str;
};
