RS.Controls.SplitButton = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'splitbutton-template',
                ItemTemplateId: 'splitbutton-item-template',
            }
        ],
        CanHighlight: false,
        Text: 'Action'
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.SplitButton.superclass.constructor.call(this, self.Options, container, true);

    this.Button = null;
    this.DropdownButton = null;

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        var options = RS.Core.copy(self.Options, true);
        options.KeepOptionsFromStart = true;
        self.Button = new RS.Controls.Button(options, self.Elements.Me.find('[role="button"]:first'));

        options = RS.Core.copy(self.Options, true);
        options.KeepOptionsFromStart = true;
        self.DropdownButton = new RS.Controls.Button(options, self.Elements.Me.find('[role="dropdown-toggle"]:first'));

        return self;
    });

    this.getIdentifier = function () { return 'SplitButton'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.SplitButton, RS.Controls.Dropdown);