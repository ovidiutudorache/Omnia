RS.Controls.Popover = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'popover-template'
            }
        ],
        Title: null
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Popover.superclass.constructor.call(this, self.Options, container, true);

    this.setTitle = function (title) {
        self.Options.Title = title;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.find('[role="title"]:first').text(title);

        return self;
    };

    this.getIdentifier = function () { return 'Popover'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Popover, RS.Controls.Tooltip);