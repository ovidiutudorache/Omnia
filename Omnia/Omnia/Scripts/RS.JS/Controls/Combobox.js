RS.Controls.Combobox = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'combobox-template',
                ItemTemplateId: 'combobox-item-template'
            }
        ],
        Classes: {
            Main: 'combobox'
        }
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Combobox.superclass.constructor.call(this, self.Options, container, true);

    this.Elements.Me = null;

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Me.addClass('input-group combobox');

        return self;
    });

    this.getIdentifier = function () { return 'Combobox'; }

    if (!isInherited) {
        self.initialize();
        self.appendTo(container, true);
    }
};
extend(RS.Controls.Combobox, RS.Controls.Autocomplete);