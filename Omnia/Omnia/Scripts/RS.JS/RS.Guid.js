RS.Guid = {
    empty: function () {
        return "00000000-0000-0000-0000-000000000000";
    },
    isEmpty: function (gid) {
        return gid == this.Empty() || typeof (gid) == 'undefined' || gid == null || gid == '';
    },
    isValid: function (value) {
        rGx = new RegExp("\\b(?:[A-F0-9]{8})(?:-[A-F0-9]{4}){3}-(?:[A-F0-9]{12})\\b");
        return rGx.exec((value || "").toUpperCase()) != null;
    },
    new: function () {
        if (arguments.length == 1 && this.IsValid(arguments[0])) {
            $(this).data("value", arguments[0]);
            value = arguments[0];
        }

        var res = [], hv;
        var rgx = new RegExp("[2345]");
        for (var i = 0; i < 8; i++) {
            hv = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            if (rgx.exec(i.toString()) != null) {
                if (i == 3) { hv = "6" + hv.substr(1, 3); }
                res.push("-");
            }
            res.push(hv.toUpperCase());
        }
        value = res.join('');
        $(this).data("value", value);
        return value;
    }
};