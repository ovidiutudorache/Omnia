RS.Controls.Menu = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'menu-template',
                ItemTemplateId: 'menu-item-template'
            }
        ],
        CanHighlight: false
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Menu.superclass.constructor.call(this, self.Options, container, true);

    this.initialize = override(self.initialize, function () {
        var defaultTemplate = self.getDefaultTemplate();
        if (defaultTemplate)
            Handlebars.registerPartial("MenuItemTemplate", $("#" + defaultTemplate.ItemTemplateId).html());

        self.PubSub.addEvent('select');

        return self;
    });

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!container)
            return self;

        var items = getItemsFromContainer(container);
        self.Options.DataSource = new RS.Controls.DataSource({
            Data: items
        });

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.List = self.Elements.Me;

        self.Elements.List.on('click', '[role="listitem"]', function () {
            var id = $(this).attr('data-id');
            var item = getItem(id);
            if (item) {
                self.PubSub.triggerEvent('select', {
                    Source: self,
                    Item: item
                });
            }

            return false;
        });

        if (self.Options.DataSource)
            self.Options.DataSource.loadData();

        return self;
    });

    this.renderItems = function (options, data) {
        if (!self.Elements.Me)
            return self;

        var template = self.getDefaultTemplate();
        if (!template)
            return null;

        var html = template.Compiled({
            Items: data
        });

        self.Elements.Me.html(html);

        return self;
    };

    var getItemsFromContainer = function (el) {
        if (!el)
            return null;

        var items = null;

        el.find('> [role="listitem"]').each(function () {
            var item = {
                Id: $(this).attr('data-id'),
                Name: $(this).find('> [role="main"]:first').text() || $(this).text()
            };

            item.Items = getItemsFromContainer($(this).find('> [role="list"]:first'));

            if (!items)
                items = [];

            items.push(item);
        });

        return items;
    }

    var getItem = function (id, data) {
        data = data || (self.Options.DataSource ? self.Options.DataSource.Options.Data : null)
        if (!data)
            return null;

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.Id == id)
                return item;

            if (!item.Items)
                continue;

            var child = getItem(id, item.Items);
            if (child)
                return child;
        }

        return null;
    };

    this.getIdentifier = function () { return 'Menu'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Menu, RS.Controls.DataControl);