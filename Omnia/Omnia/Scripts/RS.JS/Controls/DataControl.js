RS.Controls.DataControl = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        DataSource: null,
        Paging: {
            HasContinuousPagination: false,
            ContinuousPaginationScrollingParent: null
        },
        Search: {
            CanSearch: false,
            Placeholder: 'Search...',
            MinLength: 3,
            Delay: 250,
            IsCaseSensitive: false
        },
        HighlightFirst: false,
        CanSelect: true,
        CanSelectMultiple: false,
        CanHighlight: true,
        RefreshAfterDataSourceChanged: true,
        DisplayColumn: 'Text'
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.DataControl.superclass.constructor.call(this, self.Options, container, true);

    this.Elements.List = null;

    this.HighlightedIndex = -1;
    this.SelectedIndex = -1;
    this.SelectedItem = null;
    this.SelectedItems = null;

    var lastHighlightedItem = null;
    var lastTerm = null;
    var searchTimeoutId = null;
    var dataSourceEventsBoundTo = null;

    this.initialize = override(self.initialize, function () {
        self.PubSub.addEvent('highlight');
        self.PubSub.addEvent('select');
        self.PubSub.addEvent('unselect');
        self.PubSub.addEvent('enter');

        setDataSourceEvents(self.Options.DataSource);

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Search = self.Elements.Me.find('[role="search"]:first');
        self.Elements.List = self.Elements.Me.attr('role') == 'list' ? self.Elements.Me : self.Elements.Me.find('[role="list"]:first');
        self.setCanSearch(self.Options.Search.CanSearch);
        self.setPlaceholder(self.Options.Search.Placeholder);
        self.setContinuousPaginationScrollingParent(self.Options.Paging.ContinuousPaginationScrollingParent || self.Elements.Me.parent());

        self.Elements.List.on('click', '[role="listitem"]', function (e) {
            if (!self.Options.CanSelect)
                return true;

            var el = $(this);
            var index = el.parent().children().index(el);
            self.selectIndex(index);

            return false;
        });

        self.Elements.List.on('dblclick', '[role="listitem"]', function (e) {
            var el = $(this);
            var index = el.parent().children().index(el);
            self.PubSub.triggerEvent('enter', {
                Source: self,
                Index: index
            });
        });

        self.Elements.Search.keyup(function (e) { handleSearchKeyPressed(e); return false; });

        self.Elements.Me.keydown(function (e) {
            if (e.keyCode == RS.Keys.DOWN) {
                self.highlightIndex(self.HighlightedIndex + 1);

                return false;
            }
            else if (e.keyCode == RS.Keys.UP) {
                self.highlightIndex(self.HighlightedIndex - 1);

                return false;
            }
            else if (e.keyCode == RS.Keys.ENTER || (e.keyCode == RS.Keys.SPACE && self.Elements.Search && !self.Elements.Search.val())) {
                self.selectIndex(self.HighlightedIndex);

                return false;
            }
            else if (e.keyCode == RS.Keys.HOME && !e.shiftKey) {
                self.highlightIndex(0);

                return false;
            }
            else if (e.keyCode == RS.Keys.END && !e.shiftKey) {
                self.highlightIndex(Infinity);

                return false;
            }
            else if (e.keyCode == RS.Keys.PAGE_UP || e.keyCode == RS.Keys.PAGE_DOWN) {
                var itemsPerPage = Math.round(self.Elements.List.height() / (self.Elements.List.find('[role="listitem"]:first').height() || 30));

                if (e.keyCode == RS.Keys.PAGE_UP)
                    self.highlightIndex(self.HighlightedIndex - itemsPerPage);
                else self.highlightIndex(self.HighlightedIndex + itemsPerPage);

                return false;
            }

            return true;
        });

        self.Elements.Me.bind('focusin', function (e) {
            if (self.IsOpen && self.Options.Search.CanSearch && self.Elements.Search) {
                if ($(e.target)[0] == self.Elements.Search[0])
                    return true;

                self.Elements.Search.focus();
            }
        });

        solveUrlBindings(self.Options.DataSource);

        return self;
    });

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!container)
            return self;

        var dataSource = self.getDataSourceFromContainer();
        if (dataSource)
            self.setDataSource(dataSource, false);

        return self;
    });

    this.getDataSourceFromContainer = function () {
        if (!container)
            return null;

        var dataSource = null;

        var dataSourceOptions = RS.Utils.getOptionsFromAttributes(container, 'data-source-options') || {};
        if (!dataSourceOptions)
            return null;

        dataSource = new RS.Controls.DataSource(dataSourceOptions);

        return dataSource;
    };

    this.setContinuousPaginationScrollingParent = function (container) {
        self.Options.Paging.ContinuousPaginationScrollingParent = typeof container == 'string' ? $(container) : container;

        if (self.Options.Paging.HasContinuousPagination && self.Options.Paging.ContinuousPaginationScrollingParent) {
            self.Options.Paging.ContinuousPaginationScrollingParent.scroll(function () {
                if (self.checkIfShouldLoadNextPageForContinuousPagination())
                    return false;
            });
        }

        return self;
    }

    this.checkIfShouldLoadNextPageForContinuousPagination = function () {
        if (!self.Options.DataSource || self.Options.DataSource.IsLoading || !self.Options.Paging.HasContinuousPagination || !self.Options.DataSource.Options.RemoteCall.Url)
            return false;

        var scrollParent = self.Options.Paging.ContinuousPaginationScrollingParent;

        if (scrollParent[0] == document && $(window).scrollTop() + $(window).height() == $(document).height()) {
            self.Options.DataSource.goToNextPage();

            return true;
        }
        else if (scrollParent.scrollTop() + scrollParent.innerHeight() >= scrollParent[0].scrollHeight) {
            self.Options.DataSource.goToNextPage();

            return true;
        }

        return false;
    };

    this.setCanSearch = function (canSearch) {
        self.Options.Search.CanSearch = canSearch;

        if (!self.Elements.Me)
            return self;

        if (canSearch) {
            if (self.Options.DataSource)
                self.Options.DataSource.IsCaseSensitive = self.Options.Search.IsCaseSensitive;

            self.Elements.Search.show();

            if (!self.Elements.List.hasClass('search'))
                self.Elements.List.addClass('search');
        }
        else {
            self.Elements.Search.hide();
            self.Elements.List.removeClass('search');
        }

        return self;
    };

    this.setPlaceholder = function (placeholder) {
        self.Options.Search.Placeholder = placeholder;

        if (!self.Elements.Me)
            return self;

        self.Elements.Search.attr('placeholder', placeholder);

        return self;
    };

    this.highlightIndex = function (index) {
        if (!self.Options.CanHighlight || !self.Options.DataSource || !self.Options.DataSource.Options.Data)
            return self;

        var data = self.Options.Search.CanSearch ? (self.Options.DataSource.FilteredData || self.Options.DataSource.Options.Data) : self.Options.DataSource.getDataSet();
        if (data && self.Options.DataSource.Options.IsComplex)
            data = data.Rows;

        index = Math.max(0, Math.min(index || 0, data.length - 1));
        if (self.HighlightedIndex == index)
            return self;

        if (lastHighlightedItem)
            lastHighlightedItem.removeClass('active');

        lastHighlightedItem = self.Elements.List.find('> [role="listitem"]:eq(' + index + ')');
        lastHighlightedItem.addClass('active');

        self.HighlightedIndex = index;

        bringItemIntoView(lastHighlightedItem);

        self.PubSub.triggerEvent('highlight', {
            Source: self,
            Index: index
        });

        return self;
    };

    this.canSelect = function (index) {
        return true;
    };

    this.processItem = function (item) {
        var dataSource = self.Options.DataSource;
        if (dataSource && dataSource.Options.IsComplex) {
            var itemFromRow = dataSource.getItemFromRow(item);

            return itemFromRow;
        }

        return item;
    };

    this.selectIndex = function (index) {
        if (!self.canSelect(index) || !self.Options.CanSelect || !self.Options.DataSource || !self.Options.DataSource.Options.Data)
            return self;

        if (self.Options.CanHighlight)
            self.highlightIndex(index);

        var data = self.Options.Search.CanSearch ? (self.Options.DataSource.FilteredData || self.Options.DataSource.Options.Data) : self.Options.DataSource.getDataSet();
        if (data && self.Options.DataSource.Options.IsComplex)
            data = data.Rows;

        index = Math.max(0, Math.min(index || 0, data.length - 1));
        if (self.SelectedIndex == index && !self.Options.CanSelectMultiple)
            return self;

        self.SelectedIndex = index;
        self.SelectedItem = self.processItem(data[index]);

        if (self.Options.CanSelectMultiple) {
            self.SelectedItem.IsSelected = !self.SelectedItem.IsSelected;

            if (self.SelectedItem.IsSelected) {
                self.SelectedItems = self.SelectedItems || [];
                self.SelectedItems.push(self.SelectedItem);
            }
            else {
                var existingIndex = self.SelectedItems.findFirstKeyIndex('Id', self.SelectedItem.Id);
                if (existingIndex > -1)
                    self.SelectedItems.splice(existingIndex, 1);
            }

            var element = self.Elements.List.find('> [role="listitem"]:eq(' + index + ')');
            element.toggleClass('selected');
        }

        if (!self.Options.CanSelectMultiple || (self.Options.CanSelectMultiple && self.SelectedItem.IsSelected)) {
            self.PubSub.triggerEvent('select', {
                Source: self,
                Index: index,
                Item: self.SelectedItem
            });

            self.PubSub.triggerEvent('change', {
                Source: this,
                Property: 'SelectedIndex'
            });
        }
        else if (self.Options.CanSelectMultiple) {
            self.PubSub.triggerEvent('unselect', {
                Source: self,
                Index: index,
                Item: self.SelectedItem
            });

            self.PubSub.triggerEvent('change', {
                Source: this,
                Property: 'SelectedIndex'
            });
        }

        return self;
    };

    this.deselect = function () {
        if (!self.SelectedItem && !self.SelectedItems)
            return;

        self.HighlightedIndex = -1;
        if (lastHighlightedItem)
            lastHighlightedItem.removeClass('active');

        self.Elements.List.find('> [role="listitem"]').removeClass('selected');

        self.PubSub.triggerEvent('unselect', {
            Source: self,
            Index: self.SelectedIndex,
            Item: self.SelectedItem
        });

        self.SelectedIndex = -1;
        self.SelectedItem = null;
        self.SelectedItems = null;

        self.PubSub.triggerEvent('change', {
            Source: this,
            Property: 'SelectedIndex'
        });

        self.PubSub.triggerEvent('select', {
            Source: self,
            Index: -1,
            Item: null
        });
    };

    this.setDataSource = function (dataSource, loadNow) {
        if (self.Options.DataSource == dataSource)
            return self;

        self.Options.DataSource = dataSource;
        solveUrlBindings(dataSource);
        setDataSourceEvents(dataSource);

        if (dataSource && self.Options.RefreshAfterDataSourceChanged && loadNow !== false)
            dataSource.refresh();

        return self;
    };

    var solveUrlBindings = function (dataSource) {
        if (!dataSource || !dataSource.Options.RemoteCall || !dataSource.Options.RemoteCall.Url || !self.Elements.Me)
            return;

        var controller = RS.ControllersManager.getElementController(self.Elements.Me, true);
        if (!controller || !controller.PubSub)
            return;

        if (controller.Model && dataSource.Options.RemoteCall.Parameters) {
            for (var i = 0; i < dataSource.Options.RemoteCall.Parameters.length; i++) {
                var p = dataSource.Options.RemoteCall.Parameters[i];
                if (!p || !p.Name)
                    continue;

                var binding = p.Binding || p.Name;
                var path = binding.split('.');
                if (!path || !path.length || !(path[0] in controller.Model))
                    continue;

                dataSource.Options.RemoteCall.BoundModelParameters = dataSource.Options.RemoteCall.BoundModelParameters || {};
                dataSource.Options.RemoteCall.BoundModelParameters[path[0]] = 1;

                var value = RS.Utils.getValue(controller.Model, binding);
                dataSource.setParameter(p.Name, value);
            }
        }

        controller.PubSub.addListener('change', function (e) {
            if (dataSource.Options.RemoteCall.BoundModelParameters && dataSource.Options.RemoteCall.BoundModelParameters[e.Property] == 1) {
                dataSource.setParameter(e.Property, e.Value, controller.Model);

                self.reactToParameterChange(e);
            }
        });
    };

    this.reactToParameterChange = function (e) {
        if (!e || !self.Options.DataSource)
            return;

        self.Options.DataSource.refresh();
    };

    var setDataSourceEvents = function (dataSource) {
        if (!dataSource || dataSourceEventsBoundTo == dataSource)
            return;

        dataSourceEventsBoundTo = dataSource;

        if (self.Options.Search.CanSearch)
            dataSource.Options.IsCaseSensitive = self.Options.Search.IsCaseSensitive;

        dataSource.PubSub.addListener('refresh', function (e) {
            self.renderItems(e.Options, e.Data);
        });

        dataSource.PubSub.addListener('add', function (e) {
            self.renderItems({
                Index: e.Index
            }, e.Items);
        });

        dataSource.PubSub.addListener('clear', function (e) {
            self.clear(e.Options);
        });
    };

    this.search = function (term) {
        if ((term || '') == (lastTerm || ''))
            return;

        if (term && self.Options.Search.MinLength && (term || '').length < self.Options.Search.MinLength)
            return;

        lastTerm = term;

        self.Options.DataSource.setParameter('term', term);
        self.Options.DataSource.refresh();
    };

    this.clear = function (options) {
        if (options && options.IsRefresh)
            return;

        if (!self.Elements.List)
            return;

        self.HighlightedIndex = -1;
        self.SelectedIndex = -1;
        self.SelectedItem = null;

        self.Elements.List.empty();

        self.PubSub.triggerEvent('change', {
            Source: this,
            Property: 'SelectedIndex'
        });

        self.PubSub.triggerEvent('select', {
            Source: self,
            Index: -1,
            Item: null
        });
    };

    var bringItemIntoView = function (item) {
        if (!item)
            return;

        var pos = item.position();
        if (!pos)
            return;

        var scrollTopTo = -1;
        if (pos.top < 0)
            scrollTopTo = self.Elements.List.scrollTop() + pos.top;
        else if (pos.top + item.height() > self.Elements.List.height())
            scrollTopTo = self.Elements.List.scrollTop() + pos.top + item.height() - self.Elements.List.height();

        if (scrollTopTo >= 0)
            self.Elements.List.scrollTop(scrollTopTo);
    };

    var handleSearchKeyPressed = function (e) {
        var term = self.Elements.Search.val();

        if (!self.Elements.Search || !self.Options.Search.CanSearch || !self.Options.DataSource || e.keyCode == RS.Keys.ENTER || (e.keyCode == RS.Keys.SPACE && !term))
            return;

        if (searchTimeoutId)
            clearTimeout(searchTimeoutId);

        if (self.Options.Search.Delay) {
            searchTimeoutId = setTimeout(function () {
                self.search(term);
            }, self.Options.Search.Delay);
        }
        else self.search(term);
    };

    this.processDataBeforeRendering = function (data) {
        return data || [];
    };

    this.renderItems = function (options, data) {
        if (!self.Elements.Me)
            return self;

        if (options && options.IsRefresh) {
            self.clear();

            if (self.Elements.List)
                self.Elements.List.scrollTop();
        }

        data = self.processDataBeforeRendering(data) || [];

        if (data && self.Options.CanSelectMultiple && self.SelectedItems && self.SelectedItems.length) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (self.SelectedItems.findFirstKeyIndex('Id', item.Id) > -1)
                    item.IsSelected = true;
            }
        }

        var template = self.getDefaultTemplate();
        if (!template)
            return null;

        template.ItemCompiled = template.ItemCompiled || Handlebars.compile($("#" + template.ItemTemplateId).html());

        var html = self.getItemsHtml(data, template);

        var noChildren = self.Elements.List.children().length;
        var index = Math.max(0, Math.min(noChildren, options && options.Index ? options.Index - 1 : noChildren));

        if (index >= noChildren) {
            self.Elements.List.append(html);
        }
        else {
            var itemAtIndex = self.Elements.List.find('> [role="listitem"]:eq(' + index + ')');
            itemAtIndex.after(html);
        }

        if (options && options.IsRefresh && self.Options.HighlightFirst)
            self.highlightIndex(0);

        return self;
    };

    this.getItemsHtml = function (data, template) {
        if (!template)
            return null;

        var html = template.ItemCompiled({
            Items: data,
            Control: self
        });

        return html;
    };

    this.getIdentifier = function () { return 'DataControl'; }

    this.setValue = override(self.setValue, function (value, property, options) {
        if (property == "SelectedIndex")
            self.selectIndex(value);
    });

    this.getSelectedRow = function () {
        if (!self.SelectedItem)
            return null;

        var dataSource = self.Options.DataSource;
        if (!dataSource || !dataSource.Options.IsComplex)
            return null;

        var dataSet = dataSource.getDataSet();
        if (!dataSet || !dataSet.Rows || self.SelectedIndex >= dataSet.Rows.length)
            return null;

        return dataSet.Rows[self.SelectedIndex];
    };

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.DataControl, RS.Controls.Control);