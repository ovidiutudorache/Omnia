RS.Controls.List = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'list-template',
                ItemTemplateId: 'list-item-template'
            }
        ],
        Paging: {
            HasContinuousPagination: false
        },
        CanSelect: true,
        CanHighlight: true,
        DisplayName: 'Name'
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.List.superclass.constructor.call(this, self.Options, container, true);

    this.Elements.Me = null;

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        if (self.Options.DataSource)
            self.Options.DataSource.loadData();

        return self;
    });

    this.getDataSourceFromContainer = override(self.getDataSourceFromContainer, function () {
        if (!container)
            return null;

        if (container[0].tagName.toLowerCase() == 'ul') {
            var items = [];
            container.find('li').each(function () {
                var el = $(this);

                var item = {
                    Value: el.attr('data-value'),
                    Name: el.text()
                };

                items.push(item);
            });
        }

        var dataSourceOptions = RS.Utils.getOptionsFromAttributes(container, 'data-source-options') || {};
        if (items)
            dataSourceOptions.Data = items;

        var dataSource = new RS.Controls.DataSource(dataSourceOptions);

        return dataSource;
    });

    this.getIdentifier = function () { return 'List'; }

    if (!isInherited) {
        self.initialize();
        self.appendTo(container, true);
    }
};
extend(RS.Controls.List, RS.Controls.DataControl);