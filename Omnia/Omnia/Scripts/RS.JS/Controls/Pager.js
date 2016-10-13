RS.Controls.Pager = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'pager-template',
                ItemTemplateId: 'pager-item-template'
            }
        ],
        NoPages: 10,
        MaxDisplayedPages: 7,
        Size: RS.Controls.PagerSizes
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Pager.superclass.constructor.call(this, self.Options, container, true);

    this.SelectedIndex = -1;

    this.Elements.Me = null;
    this.Elements.List = null;
    this.Elements.Previous = null;
    this.Elements.Next = null;

    this.initialize = override(self.initialize, function () {
        self.PubSub.addEvent('select');
    });

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!self.Elements.Me)
            return self;

        self.Options.NoPages = self.Elements.Me.find('[role="listitem"]').length;
        self.Options.Size = getSizeFromContainer();

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.List = self.Elements.Me.find('[role="list"]:first');
        self.Elements.List.on('click', '> [role="listitem"]', function () {
            var index = $(this).attr('data-index');
            if (index == -2)
                index = parseInt($(this).next().attr('data-index'), 10) - 1;
            else if (index == -1)
                index = parseInt($(this).prev().attr('data-index'), 10) + 1;

            self.selectIndex(index);

            return false;
        });

        self.Elements.Previous = self.Elements.Me.find('[role="previous"]:first');
        self.Elements.Previous.click(function () { self.selectIndex(self.SelectedIndex - 1); return false; });
        self.Elements.Next = self.Elements.Me.find('[role="next"]:first');
        self.Elements.Next.click(function () { self.selectIndex(self.SelectedIndex + 1); return false; });

        self.setSize(self.Options.Size);

        render();

        return self;
    });

    this.setSize = function (size) {
        self.Options.Size = size;

        if (!self.Elements.Me)
            return self;

        self.Elements.List.removeClass('pagination-sm pagination-lg');

        if (size == RS.Controls.PagerSizes.Large)
            self.Elements.List.addClass('pagination-lg');
        else if (size == RS.Controls.PagerSizes.Small)
            self.Elements.List.addClass('pagination-sm');

        return self;
    };

    this.setNoPages = function (noPages) {
        noPages = Math.max(0, noPages);
        if (noPages == self.Options.NoPages)
            return self;

        self.Options.NoPages = noPages;
        render();

        return self;
    };

    this.selectIndex = function (index) {
        index = Math.max(0, Math.min(self.Options.NoPages - 1, index));

        if (self.SelectedIndex == index)
            return self;

        self.SelectedIndex = index;

        render();

        self.Elements.List.find('> [role="listitem"][data-index="' +  index+ '"]').addClass('active');

        self.PubSub.triggerEvent('select', {
            Source: self,
            Index: index
        });

        return self;
    };

    var getSizeFromContainer = function () {
        if (!self.Elements.Me)
            return RS.Controls.PagerSizes.Medium;

        self.Elements.List = self.Elements.Me.find('[role="list"]:first');

        if (self.Elements.List.hasClass('pagination-lg'))
            return RS.Controls.PagerSizes.Large;

        if (self.Elements.List.hasClass('pagination-sm'))
            return RS.Controls.PagerSizes.Small;

        return RS.Controls.PagerSizes.Medium;
    };

    var render = function () {
        var minIndex = Math.max(1, self.SelectedIndex - Math.floor((self.Options.MaxDisplayedPages - 2) / 2)) + 1;
        if (minIndex == 1)
            maxIndex++;

        var maxIndex = Math.min(self.Options.NoPages, minIndex + self.Options.MaxDisplayedPages - 2) - 1;

        if (maxIndex - minIndex + 1 < self.Options.MaxDisplayedPages - 2)
            minIndex = Math.max(1, maxIndex - self.Options.MaxDisplayedPages + 3);

        var template = self.getDefaultTemplate();
        if (!template)
            return;

        template.ItemCompiled = template.ItemCompiled || Handlebars.compile($("#" + template.ItemTemplateId).html());

        var html = "";
        var addedDotsLeft = false;
        var addedDotsRight = false;
        for (var i = 1; i <= self.Options.NoPages; i++) {
            if ((i == 1 || (i >= minIndex)) && ((i <= maxIndex) || i == self.Options.NoPages))
                html += template.ItemCompiled({ Number: i, Index: i - 1 });
            else {
                if (i < self.SelectedIndex && !addedDotsLeft) {
                    html += template.ItemCompiled({ Number: '...', Index: -2 });
                    addedDotsLeft = true;
                }
                else if (i > self.SelectedIndex && !addedDotsRight) {
                    html += template.ItemCompiled({ Number: '...', Index: -1 });
                    addedDotsRight = true;
                }
            }
        }

        self.Elements.List.find('[role="listitem"]').remove();

        $(html).insertAfter(self.Elements.Previous);

        setItemsLength();
    };

    var setItemsLength = function () {
        var maxWidth = 0;
        self.Elements.List.find('> [role="listitem"]').each(function () {
            maxWidth = Math.max(maxWidth, $(this).width());
        });

        self.Elements.List.find('> [role="listitem"]').each(function () {
            $(this).width(maxWidth)
        });
    };

    this.getIdentifier = function () { return 'Pager'; }

    if (!isInherited)
        self.initialize();

    self.appendTo(container, true);
};
extend(RS.Controls.Pager, RS.Controls.Control);