RS.Controls.Tooltip = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'tooltip-template'
            }
        ],
        Parent: null,
        Content: null,
        Position: 'top',
        AutoHide: true,
        Trigger: 'hover'
    };

    var positionToRestitute = null;

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Tooltip.superclass.constructor.call(this, self.Options, container, true);

    this.initialize = override(self.initialize, function () {
        if (!self.Options.Parent)
            return self;

        self.PubSub.addEvent('show');
        self.PubSub.addEvent('hide');

        self.Options.Parent.mousedown(function (e) {
            if (self.Options.Trigger == 'click') {
                if (!self.Elements.Me || !self.Elements.Me.is(":visible"))
                    self.show();
            }
        });

        self.Options.Parent.hover(function () {
            if (self.Options.Trigger == 'hover')
                self.show();
        }, function () {
            if (self.Options.Trigger == 'hover' && self.Options.AutoHide)
                self.hide();
        });

        return self;
    });

    this.show = function () {
        if (!self.Elements.Me) {
            self.appendTo(self.Options.Parent.parent());
            self.Elements.Me.mousedown(function (e) {
                if (!self.Options.AutoHide || self.Options.Trigger == 'click')
                    self.hide();

                return false;
            });
        }

        var desiredPosition = getPosition(self.Options.Position);

        positionToRestitute = self.Options.Position;

        if (desiredPosition.y < 0) {
            self.setPosition('bottom', true);
            desiredPosition = getPosition('bottom');
        }
        else if (desiredPosition.x < 0) {
            self.setPosition('right', true);
            desiredPosition = getPosition('right');
        }

        setPosition(desiredPosition);

        if (self.Elements.Me.offset().top + self.Elements.Me.outerHeight() > $(document).height()) {
            self.setPosition('top', true);
            desiredPosition = getPosition('top');
            setPosition(desiredPosition);
        }
        else if (self.Elements.Me.offset().left + self.Elements.Me.outerWidth() > $(document).width()) {
            self.setPosition('left', true);
            desiredPosition = getPosition('left');
            setPosition(desiredPosition);
        }

        self.Elements.Me.show();
        self.PubSub.triggerEvent('show', {
            Source: self
        });

        return self;
    };

    this.hide = function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Me.hide();

        self.setPosition(self.Options.Position);

        self.PubSub.triggerEvent('hide', {
            Source: self
        });

        return self;
    };

    this.setPosition = function (position, skipOverwriteSetting) {
        position = position || 'right';

        if (!skipOverwriteSetting)
            self.Options.Position = position;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.removeClass('top right bottom left').addClass(position);

        return self;
    }

    var setPosition = function (desiredPosition) {
        if (!self.Elements.Me || !desiredPosition)
            return;

        self.Elements.Me.css({
            'left': desiredPosition.x,
            'top': desiredPosition.y
        });
    };

    var getPosition = function (position) {
        var x = 0.0, y = 0.0;

        var parentPosition = self.Options.Parent.css('position') == 'fixed' ? self.Options.Parent.offset() : self.Options.Parent.position();

        if (position == 'top') {
            x = parentPosition.left + self.Options.Parent.outerWidth() / 2.0 - self.Elements.Me.outerWidth() / 2.0;
            y = parentPosition.top - self.Elements.Me.outerHeight()
        }
        else if (position == 'right') {
            x = parentPosition.left + self.Options.Parent.outerWidth();
            y = parentPosition.top + self.Options.Parent.outerHeight() / 2.0 - self.Elements.Me.outerHeight() / 2.0
        }
        else if (position == 'bottom') {
            x = parentPosition.left + self.Options.Parent.outerWidth() / 2.0 - self.Elements.Me.outerWidth() / 2.0;
            y = parentPosition.top + self.Options.Parent.outerHeight()
        }
        else if (position == 'left') {
            x = parentPosition.left - self.Elements.Me.outerWidth();
            y = parentPosition.top + self.Options.Parent.outerHeight() / 2.0 - self.Elements.Me.outerHeight() / 2.0
        }

        return {
            x: x,
            y: y
        };
    }

    this.getIdentifier = function () { return 'Tooltip'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Tooltip, RS.Controls.Control);