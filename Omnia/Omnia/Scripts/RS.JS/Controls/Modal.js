RS.Controls.Modal = function (options, container, isInherited) {
    var self = this;

    self.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'modal-template'
            }
        ],
        Title: null,
        Buttons: null,
        DestroyAfterClose: false,
        Parent: $("body"),
        Overlay: false,
        Size: RS.Controls.ModalSizes.Default,
        Content: null,
        CloseOnClickOutside: true,
        Width: null,
        IsFixed: true
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Modal.superclass.constructor.call(this, self.Options, container, true);

    this.Notifier = null;

    this.initialize = override(self.initialize, function () {
        self.PubSub.addEvent('show');
        self.PubSub.addEvent('hide');
        self.PubSub.addEvent('destroy');
        self.PubSub.addEvent('select');

        return self;
    });

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!container)
            return;

        self.Options.Title = getTitleFromElement();
        self.Options.Size = getSizeFromElement();
        self.Options.IsFixed = self.Elements.Me.css('display') == 'fixed';

        return self;
    });

    this.setContent = function (content) {
        if (!self.Elements.Me)
            return self;

        var body = self.Elements.Me.find('[role="dialog"]:first [role="main"]:first');
        body.empty().append(content);

        return self;
    };

    this.show = function () {
        if (!self.Elements.Me || !self.Elements.Me.parent()) {
            self.Options.Parent = self.Options.Parent || $("body");
            self.appendTo(self.Options.Parent);
            self.setSize(self.Options.Size);

            $(document).keydown(function (e) {
                if (e.keyCode == RS.Keys.ESCAPE) {
                    self.hide();

                    return false;
                }
            });

            self.Elements.Me.mousedown(function (e) {
                if (self.Options.CloseOnClickOutside && $(e.target)[0] == self.Elements.Me[0])
                    self.hide();
            });

            if (self.Options.Buttons) {
                var footer = self.Elements.Me.find('[role="footer"]');

                for (var i = 0; i < self.Options.Buttons.length; i++) {
                    var button = self.Options.Buttons[i];
                    button.PubSub.addListener('click', function (e) {
                        e.Index = self.Options.Buttons.findFirstIndex(function (item, index) { return item == e.Source; });
                        e.Button = e.Source;

                        self.PubSub.triggerEvent('select', e);

                        if (e.Index > -1 && self.Options.Buttons[e.Index] && self.Options.Buttons[e.Index].Options.Callback)
                            self.Options.Buttons[e.Index].Options.Callback({
                                Source: self
                            });

                        if (e.Button.Options.IsDismiss)
                            self.hide();
                    });

                    button.appendTo(footer);
                }
            }

            self.Notifier = new RS.Controls.Notifier({
                Container: self.Elements.Me.find('[role="alert"]')
            });
        }

        if (!self.Elements.Me)
            return self;

        if (self.Options.Overlay) {
            var backdrop = self.Options.Parent.find(".modal-backdrop");
            if (!backdrop.length)
                self.Options.Parent.append('<div class="modal-backdrop fade in"></div>');
            else backdrop.show();
        }

        if (self.Options.IsFixed) {
            self.Elements.Me.css({
                'position': 'fixed',
                'bottom': '0'
            });
        }
        else {
            self.Elements.Me.css({
                'position': 'absolute',
                'bottom': 'auto'
            });
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
        self.Options.Parent.find(".modal-backdrop").hide();
        self.PubSub.triggerEvent('hide', {
            Source: self
        });

        if (self.Options.DestroyAfterClose)
            self.destroy();

        return self;
    };

    this.destroy = function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Me.remove();
        self.Elements.Me = null;
        self.PubSub.triggerEvent('destroy', {
            Source: self
        });

        return self;
    };

    this.setTitle = function (title) {
        self.Options.Title = title;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.find('[role="title"]').text(title);

        return self;
    };

    this.setSize = function (size) {
        size = size || RS.Controls.ModalSizes.Default;
        self.Options.Size = size;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.find('[role="dialog"]').removeClass('modal-sm modal-lg').addClass(size);
        if (self.Options.Width)
            self.Elements.Me.find('[role="dialog"]').width(self.Options.Width);

        return self;
    };

    this.toggleButtonVisibility = function (index, show) {
        if (!self.Options.Buttons)
            return;

        var footer = self.Elements.Me.find('[role="footer"]');
        var button = footer.find('> [role="button"]:eq(' + index + ')');

        if (show === true)
            button.show();
        else if (show === false)
            button.hide();
        else button.toggle();
    };

    var getTitleFromElement = function () {
        if (!self.Elements.Me)
            return null;

        return self.Elements.Me.find('[role="title"]').text();
    };

    var getSizeFromElement = function () {
        if (!self.Elements.Me)
            return RS.Controls.ModalSizes.Default;

        var dialog = self.Elements.Me.find('[role="dialog"]');
        if (dialog.hasClass(RS.Controls.ModalSizes.Small)) return RS.Controls.ModalSizes.Small;
        if (dialog.hasClass(RS.Controls.ModalSizes.Large)) return RS.Controls.ModalSizes.Large;

        return RS.Controls.ModalSizes.Default;
    };

    this.getIdentifier = function () { return 'Modal'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Modal, RS.Controls.Control);