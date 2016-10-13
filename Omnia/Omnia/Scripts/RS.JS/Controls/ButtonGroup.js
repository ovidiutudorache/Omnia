RS.Controls.ButtonGroup = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'button-group-template'
            }
        ],
        Size: RS.Controls.ButtonSizes.Default,
        Orientation: RS.Controls.Orientations.Horizontal,
        IsJustified: false,
        Buttons: [],
        AllowMultipleToggle: true
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.ButtonGroup.superclass.constructor.call(this, self.Options, container, true);

    this.initialize = override(self.initialize, function () {
        if (self.Options.Buttons)
            for (var i = 0; i < self.Options.Buttons.length; i++)
                self.addButton(self.Options.Buttons[i], true);

        self.PubSub.addEvent('select');

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        self.setSize(self.Options.Size);
        self.setOrientation(self.Options.Orientation);
        self.setJustification(self.Options.IsJustified);

        return self;
    });

    this.setSize = function (size) {
        size = size || RS.Controls.ButtonSizes.Default;
        self.Options.Size = size;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.removeClass('btn-group-xs btn-group-sm btn-group-lg');

        var classToAdd = '';
        switch (size) {
            case RS.Controls.ButtonSizes.ExtraSmall: classToAdd = 'btn-group-xs'; break;
            case RS.Controls.ButtonSizes.Small: classToAdd = 'btn-group-sm'; break;
            case RS.Controls.ButtonSizes.Large: classToAdd = 'btn-group-lg'; break;
        }

        if (classToAdd)
            self.Elements.Me.addClass(classToAdd);

        return self;
    };

    this.setJustification = function (isJustified) {
        self.Options.IsJustified = isJustified;

        if (!self.Elements.Me)
            return self;

        if (isJustified)
            self.Elements.Me.addClass('btn-group-justified')
        else self.Elements.Me.removeClass('btn-group-justified');

        return self;
    };

    this.setOrientation = function (orientation) {
        orientation = orientation || RS.Controls.Orientations.Horizontal;
        self.Options.Orientation = orientation;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.removeClass('btn-group btn-group-vertical').addClass(orientation == RS.Controls.Orientations.Horizontal ? 'btn-group' : 'btn-group-vertical');

        return self;
    };

    this.addButton = function (button, skipAddingToList, skipAddingToUI) {
        if (!button)
            return self;

        self.Options.Buttons = self.Options.Buttons || [];

        if (!skipAddingToList)
            self.Options.Buttons.push(button);

        if (self.Elements.Me && !skipAddingToUI)
            button.appendTo(self.getChildrenContainer());

        if (button instanceof RS.Controls.ToggleButton) {
            button.PubSub.addListener('toggle', function (e) {
                if (!e.IsChecked)
                    return;

                if (!self.Options.AllowMultipleToggle && button instanceof RS.Controls.ToggleButton) {
                    button.Options.CanToggle = false;

                    for (var i = 0; i < self.Options.Buttons.length; i++) {
                        var b = self.Options.Buttons[i];
                        if (b == button || !(b instanceof RS.Controls.ToggleButton))
                            continue;

                        b.Options.CanToggle = true;
                        b.setChecked(false);
                    }
                }
            });
        }

        button.PubSub.addListener('click', function (e) {
            e.Index = self.Options.Buttons.findFirstIndex(function (item, index) { return item == button; });
            e.Button = button;

            self.PubSub.triggerEvent('select', e);
        });

        return self;
    };

    this.removeButton = function (button) {
        if (!button || !self.Options.Buttons)
            return self;

        var index = self.Options.Buttons.findFirstIndex(function (item, index) { return item == button; });
        if (index < 0)
            return self;

        self.Options.Buttons.splice(index, 1);

        if (button.Elements.Me)
            button.Elements.Me.remove();
    };

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!container)
            return;

        self.Options.Size = getSizeFromElement();
        self.Options.Orientation = getOrientationFromElement();
        self.Options.IsJustified = getJustificationFromElement();
        self.Options.Buttons = getButtonsFromElement();

        return self;
    });

    this.getChildrenContainer = function () {
        return self.Elements.Me;
    };

    this.getChildren = function () {
        return self.Options.Buttons;
    };

    var getButtonsFromElement = function () {
        if (!self.Elements.Me)
            return null;

        self.getChildrenContainer().find('> [role="button"]').each(function () {
            var btn = $(this).getControl();
            if (btn)
                self.addButton(btn, false, true);
        });
    };

    var getSizeFromElement = function () {
        if (!self.Elements.Me)
            return RS.Controls.ButtonSizes.Default;

        if (self.Elements.Me.hasClass('btn-group-xs')) return RS.Controls.ButtonSizes.ExtraSmall;
        if (self.Elements.Me.hasClass('btn-group-sm')) return RS.Controls.ButtonSizes.Small;
        if (self.Elements.Me.hasClass('btn-group-lg')) return RS.Controls.ButtonSizes.Large;

        return RS.Controls.ButtonSizes.Default;
    };

    var getOrientationFromElement = function () {
        if (!self.Elements.Me)
            return RS.Controls.Orientations.Horizontal;

        if (self.Elements.Me.hasClass('btn-group-vertical')) return RS.Controls.Orientations.Vertical;

        return RS.Controls.Orientations.Horizontal;
    };

    var getJustificationFromElement = function () {
        if (!self.Elements.Me)
            return false;

        return self.Elements.Me.hasClass('btn-group-justified');
    };

    this.getIdentifier = function () { return 'ButtonGroup'; }

    if (!isInherited)
    self.initialize();
};
extend(RS.Controls.ButtonGroup, RS.Controls.Control);