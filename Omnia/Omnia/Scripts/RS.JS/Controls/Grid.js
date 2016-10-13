RS.Controls.Grid = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'grid-template',
                ItemTemplateId: 'grid-item-template'
            }
        ],
        Paging: {
            HasContinuousPagination: true
        },
        CanSelect: true,
        CanHighlight: true
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Grid.superclass.constructor.call(this, self.Options, container, true);

    this.Elements.Me = null;
    this.Elements.Header = null;
    this.Elements.HeaderTable = null;
    this.Elements.Body = null;
    this.Elements.BodyTable = null;

    var hasSetHeaderColumnsWidths = false;

    this.initialize = override(self.initialize, function () {
        if (!isInherited) {
            var defaultTemplate = self.getDefaultTemplate();
            if (defaultTemplate)
                Handlebars.registerPartial("GridItemTemplate", $("#" + defaultTemplate.ItemTemplateId).html());
        }

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Header = self.Elements.Me.find('[role="header"]:first');
        self.Elements.HeaderTable = self.Elements.Header.find('table:first');

        self.Elements.Body = self.Elements.Me.find('[role="body"]:first');
        self.Elements.BodyTable = self.Elements.Body.find('table:first');
        self.Elements.List = self.Elements.Body.find('[role="list"]:first');

        self.setContinuousPaginationScrollingParent(self.Elements.Body);

        if (self.Options.DataSource)
            self.Options.DataSource.loadData();

        return self;
    });

    this.renderItems = override(self.renderItems, function () {
        setHeaderColumnsWidths();

        return self;
    });

    var setHeaderColumnsWidths = function () {
        if (hasSetHeaderColumnsWidths)
            return;

        var columns = self.Elements.HeaderTable.find('th');
        for (var i = 0; i < columns.length - 1; i++) {
            var columnWidth = self.Elements.BodyTable.find('tr:first td:eq(' + i + ')').width();
            if (!columnWidth)
                continue;

            self.Elements.Me.find('colgroup:first col:eq(' + i + ')').attr('width', columnWidth + 'px')
            self.Elements.HeaderTable.find('th:eq(' + i + ')').css('width', columnWidth + 'px');
        }

        hasSetHeaderColumnsWidths = true;
    };

    this.getIdentifier = function () { return 'Grid'; }

    if (!isInherited) {
        self.initialize();
        self.appendTo(container, true);
    }
};
extend(RS.Controls.Grid, RS.Controls.DataControl);