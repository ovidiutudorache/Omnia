RS.Controls.Breadcrumb = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'breadcrumb-template',
                ItemTemplateId: 'breadcrumb-item-template'
            }
        ]
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Breadcrumb.superclass.constructor.call(this, self.Options, container, true);

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!self.Elements.Me)
            return self;

        var items = [];
        var index = 0;
        self.Elements.Me.find('[role="listitem"]').each(function () {
            var el = $(this);

            items.push({
                Text: el.text()
            });

            index++;
        });

        self.Options.RefreshAfterDataSourceChanged = false;

        self.setDataSource(new RS.Controls.DataSource({
            Data: items
        }));

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        return self;
    });

    this.getIdentifier = function () { return 'Breadcrumb'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Breadcrumb, RS.Controls.DataControl);