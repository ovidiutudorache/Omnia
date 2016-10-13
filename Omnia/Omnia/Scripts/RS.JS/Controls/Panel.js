RS.Controls.Panel = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'panel-template'
            }
        ],
        HasHeader: true,
        HasFooter: false,
        Title: 'Panel'
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Panel.superclass.constructor.call(this, self.Options, container, true);

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!self.Elements.Me)
            return self;

        self.Options.Title = self.Elements.Me.find('> [role="panel-title"]:first').html();
        self.Options.HasHeader = self.Elements.Me.find('> [role="panel-header"]:first').is(":visible");
        self.Options.HasFooter = self.Elements.Me.find('> [role="panel-footer"]:first').is(":visible");

        return self;
    });

    this.setTitle = function (title) {
        self.Options.Title = title;

        if (self.Elements.Title)
            self.Elements.Title.html(title);

        return self;
    };

    this.showHeader = function () {
        self.Options.HasHeader = true;

        if (self.Elements.Header)
            self.Elements.Header.show();

        return self;
    };

    this.hideHeader = function () {
        self.Options.HasHeader = false;

        if (self.Elements.Header)
            self.Elements.Header.hide();

        return self;
    };

    this.showFooter = function () {
        self.Options.HasFooter = true;

        if (self.Elements.Footer)
            self.Elements.Footer.show();

        return self;
    };

    this.hideFooter = function () {
        self.Options.HasFooter = false;

        if (self.Elements.Footer)
            self.Elements.Footer.hide();

        return self;
    };

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Header = self.Elements.Me.find('> [role="panel-header"]:first');
        self.Elements.Title = self.Elements.Me.find('[role="panel-title"]:first');
        self.Elements.Body = self.Elements.Me.find('> [role="panel-body"]:first');
        self.Elements.Footer = self.Elements.Me.find('> [role="panel-footer"]:first');

        self.setTitle(self.Options.Title);

        if (self.Options.HasHeader)
            self.showHeader();
        else self.hideHeader();

        if (self.Options.HasFooter)
            self.showFooter();
        else self.hideFooter();

        return self;
    });

    this.getIdentifier = function () { return 'Panel'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Panel, RS.Controls.Control);