RS.Controls.ProgressBar = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'progressbar-template'
            }
        ],
        Percent: 0,
        IsStriped: false,
        IsAnimated: false
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.ProgressBar.superclass.constructor.call(this, self.Options, container, true);

    this.Elements.Percent = null;

    this.setPercent = function (percent) {
        self.Options.Percent = Math.max(0, Math.min(100, percent));

        if (!self.Elements.Me)
            return self;

        self.Elements.Percent.html(self.Options.Percent + ' %').css('width', self.Options.Percent + '%');

        return self;
    };

    this.setStriped = function (isStriped) {
        self.Options.IsStriped = isStriped;

        if (!self.Elements.Me)
            return self;

        if (isStriped && !self.Elements.Percent.hasClass('progress-bar-striped'))
            self.Elements.Percent.addClass('progress-bar-striped');
        if (!isStriped)
            self.Elements.Percent.removeClass('progress-bar-striped');

        return self;
    };

    this.setAnimated = function (isAnimated) {
        self.Options.IsAnimated = isAnimated;

        if (!self.Elements.Me)
            return self;

        if (isAnimated && !self.Elements.Percent.hasClass('active'))
            self.Elements.Percent.addClass('active');
        if (!isAnimated)
            self.Elements.Percent.removeClass('active');

        return self;
    };

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!self.Elements.Me)
            return self;

        self.Options.Percent = parseInt((self.Elements.Me.Percent.html() || "").replaceAll('%', '').trim(), 10);
        if (isNaN(self.Options.Percent))
            self.Options.Percent = 0;

        self.Options.IsStriped = self.Elements.Me.Percent.hasClass('progress-bar-striped');
        self.Options.IsAnimated = self.Elements.Me.Percent.hasClass('active');

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Percent = self.Elements.Me.find('[role="main"]:first');

        self.setPercent(self.Options.Percent);
        self.setStriped(self.Options.IsStriped);
        self.setAnimated(self.Options.IsAnimated);

        return self;
    });

    this.getIdentifier = function () { return 'ProgressBar'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.ProgressBar, RS.Controls.Control);