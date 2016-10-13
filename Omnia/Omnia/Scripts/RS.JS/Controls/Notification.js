RS.Controls.Notification = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'notification-template'
            }
        ],
        Type: RS.Controls.NotificationTypes.Info,
        Title: null,
        Message: null,
        IsPinned: true,
        Position: {
            Top: null,
            Right: null,
            Bottom: null,
            Left: null
        },
        AutoHide: true,
        AutoHideAfter: 5000,
        HideOnClick: true
    };

    var hideTimeoutId = null;

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Notification.superclass.constructor.call(this, self.Options, container, true);

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Me.css({
            'position': self.Options.IsPinned ? 'fixed' : 'relative',
            'top': self.Options.Position.Top,
            'right': self.Options.Position.Right,
            'bottom': self.Options.Position.Bottom,
            'left': self.Options.Position.Left
        });

        self.Elements.Me.bind('mousedown', function (e) {
            if (self.Options.HideOnClick) {
                self.hide();

                return false;
            }
        });

        self.Elements.Me.find('[role="close"]').click(function (e) {
            self.hide();

            return false;
        });

        return self;
    });

    this.show = function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Me.show();

        if (self.Options.AutoHide && self.Options.AutoHideAfter) {
            if (hideTimeoutId)
                clearTimeout(hideTimeoutId);

            hideTimeoutId = setTimeout(function () { self.hide(); }, self.Options.AutoHideAfter)
        }

        return self;
    };

    this.hide = function () {
        if (!self.Elements.Me)
            return self;

        if (hideTimeoutId)
            clearTimeout(hideTimeoutId);

        self.Elements.Me.remove();

        return self;
    };

    this.setType = function (type) {
        type = type || RS.Controls.NotificationTypes.Info;
        self.Options.Type = type;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.removeClass('alert-success alert-info alert-warning alert-danger').addClass(type);

        return self;
    }

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!container)
            return;

        self.Options.Title = getTitleFromElement();
        self.Options.Message = getMessageFromElement();
        self.Options.Type = getTypeFromElement();

        return self;
    });

    this.setTitle = function (title) {
        self.Options.Title = title;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.find('[role="title"]').text(title);

        return self;
    };

    var getTitleFromElement = function () {
        if (!self.Elements.Me)
            return null;

        return self.Elements.Me.find('[role="title"]').text();
    };

    this.setMessage = function (message) {
        self.Options.Message = message;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.find('[role="message"]').text(message);

        return self;
    };

    var getMessageFromElement = function () {
        if (!self.Elements.Me)
            return null;

        return self.Elements.Me.find('[role="message"]').text();
    };

    var getTypeFromElement = function () {
        if (!self.Elements.Me)
            return RS.Controls.NotificationTypes.Info;

        if (self.Elements.Me.hasClass('alert-success')) return RS.Controls.NotificationTypes.Success;
        if (self.Elements.Me.hasClass('alert-info')) return RS.Controls.NotificationTypes.Info;
        if (self.Elements.Me.hasClass('alert-warning')) return RS.Controls.NotificationTypes.Warning;
        if (self.Elements.Me.hasClass('alert-danger')) return RS.Controls.NotificationTypes.Danger;

        return RS.Controls.NotificationTypes.Info;
    };

    this.getIdentifier = function () { return 'Notification'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Notification, RS.Controls.Control);