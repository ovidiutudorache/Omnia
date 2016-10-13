RS.Controls.ToggleButton = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        IsChecked: false,
        CanToggle: true
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.ToggleButton.superclass.constructor.call(this, self.Options, container, true);

    this.initialize = override(self.initialize, function () {
        self.PubSub.addEvent('toggle');
        self.PubSub.addListener('click', function () {
            self.setChecked(!self.Options.IsChecked);
        });

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        self.setChecked(self.Options.IsChecked);

        return self;
    });

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!container)
            return;

        self.Options.IsChecked = getIsCheckedFromElement();

        return self;
    });

    this.setChecked = function (isChecked) {
        if (self.Options.IsChecked == isChecked || !self.Options.CanToggle)
            return self;

        self.Options.IsChecked = isChecked;

        self.PubSub.triggerEvent('toggle', {
            Source: self,
            IsChecked: isChecked
        });

        if (!self.Elements.Me)
            return self;

        if (!isChecked)
            self.Elements.Me.removeClass('active');
        else if (!self.Elements.Me.hasClass('active'))
            self.Elements.Me.addClass('active');

        return self;
    };

    var getIsCheckedFromElement = function () {
        if (!self.Elements.Me)
            return false;

        return self.Elements.Me.hasClass('active');
    };

    this.getIdentifier = function () { return 'ToggleButton'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.ToggleButton, RS.Controls.Button);