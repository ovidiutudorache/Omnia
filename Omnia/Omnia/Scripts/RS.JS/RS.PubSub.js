RS.PubSub = function () {
    var self = this;

    var events = [];

    this.addEvent = function (eventName) {
        if (!eventName || getEvent(eventName))
            return;

        events.push({
            Name: eventName,
            Listeners: []
        });
    };

    this.removeEvent = function (eventName) {
        if (!eventName)
            return;

        for (var i = 0; i < events.length; i++) {
            var e = events[i];

            if (e.Name == eventName) {
                events.splice(i, 1);
                return;
            }
        }
    }

    this.addListener = function (eventName, listener) {
        if (!listener)
            return;

        var event = getEvent(eventName);
        if (!event)
            return;

        for (var i = 0; i < event.Listeners.length; i++) {
            var l = event.Listeners[i];
            if (l == listener)
                return;
        }

        event.Listeners.push(listener);
    };

    this.removeListener = function (eventName, listener) {
        if (!listener)
            return;

        var event = getEvent(eventName);
        if (!event)
            return;

        for (var i = 0; i < event.Listeners.length; i++) {
            var l = event.Listeners[i];
            if (l == listener) {
                event.Listeners.splice(i, 1);
                return;
            }
        }
    };

    this.triggerEvent = function (eventName, data) {
        var event = getEvent(eventName);
        if (!event)
            return;

        for (var i = 0; i < event.Listeners.length; i++) {
            var l = event.Listeners[i];
            if (l)
                l(data);
        }
    };

    var getEvent = function (eventName) {
        if (!eventName)
            return null;

        var searchedEvents = $.grep(events, function (el, index) { return el.Name == eventName });
        return searchedEvents.length ? searchedEvents[0] : null;
    };
};