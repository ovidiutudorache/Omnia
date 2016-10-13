RS.Controls.Notifier = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        IsPinned: true,
        Position: {
            Top: null,
            Right: null,
            Bottom: null,
            Left: null
        },
        AutoHide: true,
        AutoHideAfter: 5000,
        HideOnClick: true,
        Container: null
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    self.Options.Container = self.Options.Container || $("body");

    var notification = null;

    RS.Controls.Notifier.superclass.constructor.call(this, self.Options, container, true);

    this.show = function (type, message, title) {
        self.hide();

        notification = new RS.Controls.Notification({
            Title: title,
            Message: message,
            IsPinned: self.Options.IsPinned,
            Position: self.Options.Position,
            AutoHide: self.Options.AutoHide,
            AutoHideAfter: self.Options.AutoHideAfter,
            HideOnClick: self.Options.HideOnClick,
            Type: type
        });

        notification.appendTo(self.Options.Container);
        notification.show();
    };

    this.showInfo = function (message, title) { return self.show(RS.Controls.NotificationTypes.Info, message, title); }
    this.showWarning = function (message, title) { return self.show(RS.Controls.NotificationTypes.Warning, message, title); }
    this.showDanger = function (message, title) { return self.show(RS.Controls.NotificationTypes.Danger, message, title); }
    this.showSuccess = function (message, title) { return self.show(RS.Controls.NotificationTypes.Success, message, title); }
    this.hide = function () {
        if (notification)
            notification.hide();
    };

    this.getIdentifier = function () { return 'Notifier'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Notifier, RS.Controls.Control);