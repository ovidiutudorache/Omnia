RS.Controls.Tab = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'tab-template'
            }
        ]
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Tab.superclass.constructor.call(this, self.Options, container, true);

    var lastSelectedTabPanel = null;

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!self.Elements.Me)
            return self;

        var items = [];
        var index = 0;
        self.Elements.Me.find('[role="main"]:first > [role="tabpanel"]').each(function () {
            var el = $(this);

            var name = self.Elements.Me.find('[role="list"]:first > [role="tabpanel"]:eq(' + index + ') [role="tab"]').text();
            var item = new RS.Controls.TabItem(el.attr('id'), name, el.html());
            items.push(item);

            index++;
        });

        self.Options.RefreshAfterDataSourceChanged = false;

        self.setDataSource(new RS.Controls.DataSource({
            Data: items
        }));

        return self;
    });

    this.selectIndex = override(self.selectIndex, function (index) {
        if (!self.Elements.Me)
            return self;

        var selectedTabPanel = self.Elements.Me.find('> [role="main"] > [role="tabpanel"]:eq(' + self.SelectedIndex + ')');
        if (selectedTabPanel.hasClass('active'))
            return self;

        self.Elements.TabList.find('> [role="listitem"]').removeClass('active');
        self.Elements.TabList.find('> [role="listitem"]:eq(' + self.SelectedIndex + ')').addClass('active');

        if (lastSelectedTabPanel)
            lastSelectedTabPanel.removeClass('active').hide();

        selectedTabPanel.addClass('active').show();

        lastSelectedTabPanel = selectedTabPanel;

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.TabList = self.Elements.Me.find('[role="list"]:first');

        return self;
    });

    this.getIdentifier = function () { return 'Tab'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Tab, RS.Controls.DataControl);