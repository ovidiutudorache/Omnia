RS.Controls.Dropdown = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'dropdown-template',
                ItemTemplateId: 'dropdown-item-template',
                SelectedItemTemplateId: 'dropdown-selected-item-template'
            }
        ],
        SelectText: 'Select',
        Paging: {
            HasContinuousPagination: true
        },
        CloseAfterSelect: true,
        CanSelect: true,
        CanHighlight: true,
        DisplayName: 'Text'
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Dropdown.superclass.constructor.call(this, self.Options, container, true);

    this.Elements.Me = null;
    this.Elements.Popover = null;
    this.IsOpen = false;

    var openedAtLeastOnce = false;

    this.initialize = override(self.initialize, function () {
        self.PubSub.addEvent('open');
        self.PubSub.addEvent('close');

        if (!isInherited) {
            var defaultTemplate = self.getDefaultTemplate();
            if (defaultTemplate.SelectedItemTemplateId)
                Handlebars.registerPartial("DropdownSelectedItemTemplate", $("#" + defaultTemplate.SelectedItemTemplateId).html());
        }

        return self;
    });

    this.getDataSourceFromContainer = override(self.getDataSourceFromContainer, function () {
        if (!container)
            return null;

        if (container[0].tagName.toLowerCase() == 'select') {
            var items = [];
            container.find('option').each(function () {
                var el = $(this);

                var item = {
                    Value: el.attr('value'),
                    Text: el.text()
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

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Popover = self.Elements.Me.find('[role="popover"]:first');

        self.Elements.Me.find('[role="dropdown-toggle"]').click(function () {
            self.toggle();

            return false;
        });

        self.setContinuousPaginationScrollingParent(self.Elements.List);

        setSummary();

        return self;
    });

    this.canSelect = function (index) {
        return self.IsOpen;
    };

    this.selectIndex = override(self.selectIndex, function (index) {
        if (!self.Elements.Me)
            return self;

        var selectText = null;
        if (self.Options.CanSelectMultiple) {
            setSummary(self.SelectedItems.length);
        }
        else {
            var template = self.getDefaultTemplate();
            if (template && template.SelectedItemTemplateId) {
                template.SelectedItemCompiled = template.SelectedItemCompiled || Handlebars.compile($("#" + template.SelectedItemTemplateId).html());
                var html = self.generateSelectedItemHtml();
                self.Elements.Me.find('[role="main"]:first').html(html);
            }
        }

        if (self.Options.CloseAfterSelect)
            self.close();

        return self;
    });

    this.generateSelectedItemHtml = function () {
        var template = self.getDefaultTemplate();
        var html = template.SelectedItemCompiled(self.SelectedItem);

        return html;
    };

    this.open = function () {
        if (!self.Elements.Me || self.IsOpen)
            return self;

        self.IsOpen = true;

        if (self.Elements.Popover)
            self.Elements.Popover.show();

        if (self.Options.Search.CanSearch && self.Elements.Search)
            self.Elements.Search.focus();

        if (!openedAtLeastOnce) {
            if (self.Options.DataSource)
                self.Options.DataSource.loadData();

            openedAtLeastOnce = true;
        }

        $(document).bind('mousedown', listenToClickOutside);

        self.PubSub.triggerEvent('open', {
            Source: self
        });

        return self;
    };

    this.close = function () {
        if (!self.Elements.Me || !self.IsOpen)
            return self;

        self.IsOpen = false;

        if (self.Elements.Popover)
            self.Elements.Popover.hide();

        self.PubSub.triggerEvent('hide', {
            Source: self
        });

        $(document).unbind('mousedown', listenToClickOutside);

        return self;
    };

    this.toggle = function () {
        if (self.IsOpen)
            return self.close();

        return self.open();
    };

    this.getSummaryElement = function () {
        return self.Elements.Me.find('[role="main"]:first');
    };

    this.reactToParameterChange = function (e) {
        if (!e || !self.Options.DataSource)
            return;

        self.Options.DataSource.clear();
    };

    this.deselect = override(self.deselect, function () {
        setSummary(0);
    });

    this.clear = override(self.clear, function () {
        openedAtLeastOnce = false;
        setSummary(0);
    });

    var listenToClickOutside = function (e) {
        if (!self.Elements.Me || !self.IsOpen)
            return true;

        if (!RS.Utils.isInsideElement({
            x: e.pageX,
            y: e.pageY
        }, self.Elements.List) && !RS.Utils.isInsideElement({
            x: e.pageX,
            y: e.pageY
        }, self.Elements.Me))
            return self.close();
    };

    var setSummary = function (number) {
        if (!self.Options.CanSelectMultiple) {
            self.getSummaryElement().html(self.Options.SelectText);
            return;
        }

        number = number || 0;

        var text = number + ' selected';

        self.getSummaryElement().html(text);
    };

    this.getIdentifier = function () { return 'Dropdown'; }

    if (!isInherited) {
        self.initialize();
        self.appendTo(container, true);
    }
};
extend(RS.Controls.Dropdown, RS.Controls.DataControl);