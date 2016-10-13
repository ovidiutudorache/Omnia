RS.Controls.TreeView = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
            {
                IsDefault: true,
                Id: 'treeview-template',
                ItemTemplateId: 'treeview-item-template'
            }
        ],
        Icons: {
            Expanded: 'glyphicon-minus',
            Collapsed: 'glyphicon-plus'
        },
        CanSelect: true,
        CanSelectParentNodes: true
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.TreeView.superclass.constructor.call(this, self.Options, container, true);

    this.Elements.Me = null;

    this.initialize = override(self.initialize, function () {
        Handlebars.registerPartial("TreeViewNodeChildrenTemplate", $("#treeview-item-template").html());

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.List = self.Elements.Me.attr('role') == 'list' ? self.Elements.Me : self.Elements.Me.find('[role="list"]:first');

        self.Elements.List.on('click', '.collapse-node', function () {
            var nodeElement = $(this).parents('[data-id]:first');
            var node = getNodeByElement($(this));
            if (!node)
                return;

            node.IsExpanded = false;
            $(this).removeClass(self.Options.Icons.Expanded).removeClass('collapse-node');
            $(this).addClass(self.Options.Icons.Collapsed).addClass("expand-node");
            if (node.IsSelected)
                nodeElement.addClass('active');

            var childrenElement = nodeElement.find(".treeview:first");
            childrenElement.hide();

            return false;
        });

        self.Elements.List.on('click', '.expand-node', function () {
            var nodeElement = $(this).parents('[data-id]:first');
            var node = getNodeByElement($(this));
            if (!node || !node.Nodes || !node.Nodes.length)
                return;

            node.IsExpanded = true;
            $(this).removeClass(self.Options.Icons.Collapsed).removeClass('expand-node');
            $(this).addClass(self.Options.Icons.Expanded).addClass("collapse-node");
            nodeElement.removeClass('active');

            var childrenElement = nodeElement.find(".treeview:first");

            childrenElement.show();

            return false;
        });

        self.Elements.List.on('click', 'li[data-id]', function (e) {
            if (!self.Options.CanSelect)
                return false;

            var nodeElement = $(this);
            var node = getNodeByElement(nodeElement);
            if (!node || (!self.Options.CanSelectParentNodes && node.Nodes && node.Nodes.length))
                return;

            changeNodeSelection(node, e.Data ? e.Data.IsSelected : !node.IsSelected, true, true);

            return false;
        });

        if (self.Options.DataSource)
            self.Options.DataSource.loadData();

        return self;
    });

    this.highlightIndex = function (index) { };

    this.renderItems = function (options, data) {
        var template = self.getDefaultTemplate();
        if (!template)
            return self;

        template.ItemCompiled = template.ItemCompiled || Handlebars.compile($("#" + template.ItemTemplateId).html());
        var html = template.ItemCompiled({
            Nodes: data
        });

        self.Elements.List.html(html);

        return self;
    };

    this.getNodeById = function (id) {
        if (!id)
            return null;

        if (!self.Options.DataSource || !self.Options.DataSource.Options.Data)
            return null;

        var foundNode = getChildById(id, self.Options.DataSource.Options.Data);

        return foundNode;
    };

    this.canSelect = function () {
        return false;
    };

    this.getSelectedItems = function () {
        if (!self.Options.DataSource || !self.Options.DataSource.Options.Data)
            return null;

        return getSelectedNodes(self.Options.DataSource.Options.Data);
    };

    var getSelectedNodes = function (nodes) {
        if (!nodes)
            return null;

        var selectedNodes = [];
        for (var i = 0; i < nodes.length; i++)
            selectedNodes = getNodesAsList(nodes[i], selectedNodes, function (item) { return item.IsSelected == true; });

        return selectedNodes;
    };

    var getNodesAsList = function (node, nodes, includeFunction) {
        if (!node)
            return nodes;

        if (!includeFunction || includeFunction(node))
            nodes.push(node);

        if (node.Nodes)
            for (var i = 0; i < node.Nodes.length; i++)
                getNodesAsList(node.Nodes[i], nodes, includeFunction);

        return nodes;
    };

    var changeNodeSelection = function (node, isSelected, recursive, changeUI) {
        if (!node)
            return;

        var nodeElement = null;
        node.IsSelected = isSelected;
        if (changeUI) {
            nodeElement = self.Elements.List.find('li[data-id="' + node.Id + '"]');

            if (node.IsSelected && (!node.Nodes || (node.Nodes && !node.IsExpanded))) {
                nodeElement.addClass('active');

                self.PubSub.triggerEvent('select', {
                    Source: self,
                    Item: node
                });
            }
            else {
                nodeElement.removeClass('active');
                self.PubSub.triggerEvent('unselect', {
                    Source: self,
                    Item: node
                });
            }
        }

        if (recursive && node.Nodes) {
            for (var i = 0; i < node.Nodes.length; i++)
                changeNodeSelection(node.Nodes[i], isSelected, recursive, changeUI);
        }
    };

    var getNodeByElement = function (el) {
        if (!el)
            return null;

        if (!el.hasClass('list-group-item'))
            return getNodeByElement(el.parents('.list-group-item:first'));

        var node = el.data('node');
        if (node)
            return node;

        var nodeId = el.attr('data-id');
        node = self.getNodeById(nodeId);
        el.data('node', node);

        return node;
    };

    var getChildById = function (id, nodes) {
        if (!id || !nodes)
            return null;

        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.Id == id)
                return n;

            var childNode = getChildById(id, n.Nodes);
            if (childNode)
                return childNode;
        }

        return null;
    };

    this.getIdentifier = function () { return 'TreeView'; }

    if (!isInherited) {
        self.initialize();
        self.appendTo(container, true);
    }
};
extend(RS.Controls.TreeView, RS.Controls.DataControl);