RS.Controls.Autocomplete = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'autocomplete-template',
                ItemTemplateId: 'autocomplete-item-template'
            }
        ],
        Search: {
            CanSearch: true,
            MinLength: 0
        },
        HighlightFirst: true,
        OpenOnFocus: true,
        Classes: {
            Main: 'dropdown'
        }
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Autocomplete.superclass.constructor.call(this, self.Options, container, true);

    this.Elements.Me = null;
    this.Elements.SummaryContainer = null;

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.SummaryContainer = self.Elements.Me.find('[role="summary-container"]:first');

        self.Elements.Me.removeClass(self.Options.Classes.Main + ' input-group');

        if (self.Options.CanSelectMultiple) {
            self.Elements.Me.addClass('input-group');
            self.Elements.SummaryContainer.addClass('visible');
        }
        else self.Elements.Me.addClass(self.Options.Classes.Main);

        self.Elements.Search.focus(function () {
            if (self.Options.OpenOnFocus)
                self.open();
        });

        self.Elements.Search.dblclick(function () {
            if (self.Options.OpenOnFocus)
                self.open();
        });

        return self;
    });

    this.search = override(self.search, function (term) {
        if (!self.IsOpen)
            self.open();

        return self;
    });

    this.selectIndex = override(self.selectIndex, function (index) {
        if (!self.SelectedItem)
            return self;

        if (self.Options.CanSelectMultiple) {
            self.Elements.Search.val('');
        }
        else {
            self.Elements.Search.val(self.SelectedItem[self.Options.DisplayColumn]);
        }

        return self;
    });

    this.getSummaryElement = function () {
        return self.Elements.Me.find('[role="summary"]:first');
    };

    this.getIdentifier = function () { return 'Autocomplete'; }

    if (!isInherited) {
        self.initialize();
        self.appendTo(container, true);
    }
};
extend(RS.Controls.Autocomplete, RS.Controls.Dropdown);