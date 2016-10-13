RS.Controls.ControlsGenerator = (function () {
    var self = this;

    var registeredBuilders = [];

    var listenForControls = function (container) {
        container = container || $(document);

        container.on('DOMNodeInserted', function (e) {
            var elementInserted = $(e.target);
            generateControlsInContainer(elementInserted);
        });
    };

    var getBuilder = function (name) {
        if (!name)
            return null;

        name = name.toLowerCase();
        for (var i = 0; i < registeredBuilders.length; i++) {
            var rb = registeredBuilders[i];
            if (rb.Name.toLowerCase() == name)
                return rb;
        }

        return null;
    };

    var registerBuilder = function (name, builder) {
        var existingBuilder = getBuilder(name);
        if (existingBuilder != null)
            existingBuilder = builder;
        else registeredBuilders.push(builder);
    };

    var generateControlsInContainer = function (container) {
        container = container || $(document);
        generateControl(container);
        container.find('[data-control]').each(function () {
            generateControl($(this));
        });
    };

    var generateControl = function (el) {
        if (!el)
            return;

        if (el.data('generator-initialized'))
            return;

        el.data('generator-initialized', true);

        var controlType = (el.attr('data-control') || '');
        if (!controlType)
            return;

        var builder = getBuilder(controlType);
        if (builder) {
            builder.build(el);
            RS.Event.sendEvent(el, 'control-initialized');
        }
    };

    return {
        listenForControls: function (container) { listenForControls(container); },
        generateControl: function (el) { generateControl(el); },
        generateControlsInContainer: function (container) { generateControlsInContainer(container); },
        registerBuilder: function (name, builder) { registerBuilder(name, builder); }
    };
})();

RS.Controls.ControlsGenerator.registerBuilder('Container', {
    Name: 'Container',
    build: function (el) {
        new RS.Controls.Container(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Button', {
    Name: 'Button',
    build: function (el) {
        new RS.Controls.Button(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('ToggleButton', {
    Name: 'ToggleButton',
    build: function (el) {
        new RS.Controls.ToggleButton(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('ButtonGroup', {
    Name: 'ButtonGroup',
    build: function (el) {
        new RS.Controls.ButtonGroup(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Modal', {
    Name: 'Modal',
    build: function (el) {
        new RS.Controls.ButtonGroup(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Tooltip', {
    Name: 'Tooltip',
    build: function (el) {
        new RS.Controls.Tooltip(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Popover', {
    Name: 'Popover',
    build: function (el) {
        new RS.Controls.Popover(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Dropdown', {
    Name: 'Dropdown',
    build: function (el) {
        new RS.Controls.Dropdown(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('ButtonDropdown', {
    Name: 'ButtonDropdown',
    build: function (el) {
        new RS.Controls.ButtonDropdown(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('SplitButton', {
    Name: 'SplitButton',
    build: function (el) {
        new RS.Controls.SplitButton(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('List', {
    Name: 'List',
    build: function (el) {
        new RS.Controls.List(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Tab', {
    Name: 'Tab',
    build: function (el) {
        new RS.Controls.Tab(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Breadcrumb', {
    Name: 'Breadcrumb',
    build: function (el) {
        new RS.Controls.Breadcrumb(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Panel', {
    Name: 'Panel',
    build: function (el) {
        new RS.Controls.Panel(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('ProgressBar', {
    Name: 'ProgressBar',
    build: function (el) {
        new RS.Controls.ProgressBar(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Pager', {
    Name: 'Pager',
    build: function (el) {
        new RS.Controls.Pager(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Menu', {
    Name: 'Menu',
    build: function (el) {
        new RS.Controls.Menu(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Autocomplete', {
    Name: 'Autocomplete',
    build: function (el) {
        new RS.Controls.Autocomplete(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Combobox', {
    Name: 'Combobox',
    build: function (el) {
        new RS.Controls.Combobox(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('TreeView', {
    Name: 'TreeView',
    build: function (el) {
        new RS.Controls.TreeView(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('Grid', {
    Name: 'Grid',
    build: function (el) {
        new RS.Controls.Grid(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('DateTimePicker', {
    Name: 'DateTimePicker',
    build: function (el) {
        new RS.Controls.DateTimePicker(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('DataGrid', {
    Name: 'DataGrid',
    build: function (el) {
        new RS.Controls.DataGrid(null, el);
    }
});

RS.Controls.ControlsGenerator.registerBuilder('DataDropdown', {
    Name: 'DataDropdown',
    build: function (el) {
        new RS.Controls.DataDropdown(null, el);
    }
});