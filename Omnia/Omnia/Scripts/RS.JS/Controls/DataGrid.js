RS.Controls.DataGrid = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'datagrid-template',
                HeaderTemplateId: 'datagrid-header-template',
                ItemTemplateId: 'datagrid-item-template'
            }
        ],
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.DataGrid.superclass.constructor.call(this, self.Options, container, true);

    this.initialize = override(self.initialize, function () {
        if (!isInherited) {
            var defaultTemplate = self.getDefaultTemplate();
            if (defaultTemplate) {
                Handlebars.registerPartial("DataGridItemTemplate", $("#" + defaultTemplate.ItemTemplateId).html());
                Handlebars.registerPartial("DataGridHeaderTemplate", $("#" + defaultTemplate.HeaderTemplateId).html());
            }
        }

        return self;
    });

    this.processDataBeforeRendering = function (data) {
        setColumns(data);
        if (!data || !data.DataSet)
            return null;

        return data.DataSet.Rows;
    };

    var setColumns = function (result) {
        if (!result || !result.Header || !result.Header.Columns || (self.Options.Columns && self.Options.Columns.length))
            return;

        for (var i = 0; i < result.Header.Columns.length; i++) {
            var c = result.Header.Columns[i];
            if (!self.Options.Columns)
                self.Options.Columns = [];

            self.Options.Columns.push({
                Name: c.Name
            });
        }

        self.renderHeader();
    };

    this.renderHeader = function () {
        var template = self.getDefaultTemplate();
        if (!template)
            return null;

        template.HeaderCompiled = template.HeaderCompiled || Handlebars.compile($("#" + template.HeaderTemplateId).html());

        var html = template.HeaderCompiled({
            Control: self
        });

        self.Elements.Header.html(html);
    };

    this.getIdentifier = function () { return 'DataGrid'; }

    if (!isInherited) {
        self.initialize();
        self.appendTo(container, true);
    }
};
extend(RS.Controls.DataGrid, RS.Controls.Grid);