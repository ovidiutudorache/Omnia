RS.Controls.DataDropdown = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'datadropdown-template',
                ItemTemplateId: 'datadropdown-item-template',
                SelectedItemTemplateId: 'datadropdown-selected-item-template'
            }
        ],
        DisplayColumnIndex: null
    };

    this.Columns = null;

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.DataDropdown.superclass.constructor.call(this, self.Options, container, true);

    this.initialize = override(self.initialize, function () {
        self.PubSub.addEvent('open');
        self.PubSub.addEvent('close');

        if (!isInherited) {
            var defaultTemplate = self.getDefaultTemplate();
            if (defaultTemplate.SelectedItemTemplateId)
                Handlebars.registerPartial("DataDropdownSelectedItemTemplate", $("#" + defaultTemplate.SelectedItemTemplateId).html());
        }

        return self;
    });

    this.processDataBeforeRendering = function (data) {
        if (!data)
            return null;

        if (!self.Options.DisplayColumnIndex)
            calculateDisplayColumnIndex(data);

        self.Columns = data.Header ? data.Header.Columns : null;

        if (!data.DataSet)
            return null;

        return data.DataSet.Rows;
    };

    this.generateSelectedItemHtml = function () {
        var template = self.getDefaultTemplate();
        var row = self.getSelectedRow();
        var html = template.SelectedItemCompiled({
            Control: self,
            Row: row
        });

        return html;
    };

    var calculateDisplayColumnIndex = function (data) {
        if (!data || !data.Header || !data.Header.Columns)
            return;

        if (!self.Options.DisplayColumn)
            return 0;

        var index = data.Header.Columns.findFirstIndex(function (item) { return item.Name == self.Options.DisplayColumn; });

        self.Options.DisplayColumnIndex = Math.max(index, 0);
    };

    if (!isInherited) {
        self.initialize();
        self.appendTo(container, true);
    }
};
extend(RS.Controls.DataDropdown, RS.Controls.Dropdown);