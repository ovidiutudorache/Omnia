RS.Event = {
    getEvent: function (e) {
        return e || window.event;
    },
    getTarget: function (e) {
        return e.target || e.srcElement;
    },
    stopPropagation: function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    },
    preventDefault: function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    },
    stopEvent: function (e) {
        this.stopPropagation(e);
        this.preventDefault(e);
        return false;
    },
    sendEvent: function (parent, eventName, data) {
        var event = jQuery.Event(eventName);
        if (data != null && data != undefined)
            event.Data = data;
        parent = parent ? parent : $(document);
        parent.trigger(event);
    }
};