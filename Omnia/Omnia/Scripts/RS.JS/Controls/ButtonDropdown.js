RS.Controls.ButtonDropdown = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'button-dropdown-template',
                ItemTemplateId: 'button-dropdown-item-template',
            }
        ],
        CanHighlight: false,
        Text: 'Action'
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.ButtonDropdown.superclass.constructor.call(this, self.Options, container, true);

    this.Button = null;

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        var options = RS.Core.copy(self.Options, true);
        options.KeepOptionsFromStart = true;
        self.Button = new RS.Controls.Button(options, self.Elements.Me.find('[role="dropdown-toggle"]:first'));

        return self;
    });

    this.getIdentifier = function () { return 'ButtonDropdown'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.ButtonDropdown, RS.Controls.Dropdown);