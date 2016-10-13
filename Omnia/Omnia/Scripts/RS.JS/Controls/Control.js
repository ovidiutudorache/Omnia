RS.Controls.Control = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: null,
        IsEnabled: true,
        Content: null,
        KeepOptionsFromStart: false
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    self.Options = $.extend(self.Options, RS.Utils.getOptionsFromAttributes(container, 'data-options'));

    this.Elements = {
        Me: container
    };

    this.PubSub = new RS.PubSub();

    this.initialize = function () {
        self.PubSub.addEvent('change');

        self.initializeFromContainer();
        self.initializeHtml();

        return self;
    };

    this.initializeHtml = function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Me.data('control', self);

        if (self.Options.IsEnabled)
            self.enable();
        else self.disable();

        return self;
    };

    this.initializeFromContainer = function () {
        if (!container)
            return self;

        self.Options.IsEnabled = container.attr('disabled') != 'disabled';

        var templateIdFromAttribute = container.attr('data-template');
        var itemTemplateIdFromAttribute = container.attr('data-item-template');

        if (!templateIdFromAttribute && !itemTemplateIdFromAttribute)
            return self;

        var template = self.getDefaultTemplate();
        if (!template) {
            template = {
                IsDefault: true
            };

            if (!self.Options.Templates)
                self.Options.Templates = [];

            self.Options.Templates.push(template);
        }

        if (templateIdFromAttribute)
            template.Id = templateIdFromAttribute;

        if (itemTemplateIdFromAttribute)
            template.ItemTemplateId = itemTemplateIdFromAttribute;

        return self;
    };

    this.appendTo = function (parent, replace) {
        if (!parent || (self.Elements.Me && parent && self.Elements.Me.parent()[0] == parent[0]))
            return;

        if (!self.Elements.Me) {
            var html = self.generateHtml();
            if (!html)
                return;

            self.Elements.Me = $(html);
            self.Elements.Me.data('control', self);
        }
        else self.Elements.Me.remove();

        var children = self.getChildren();
        if (children) {
            var childrenContainer = self.getChildrenContainer();
            for (var i = 0; i < children.length; i++)
                children[i].appendTo(childrenContainer);
        }

        if (replace) {
            transferAttributes(parent, self.Elements.Me);
            var existingId = parent.attr('id');
            parent.replaceWith(self.Elements.Me);
            if (existingId)
                self.Elements.Me.attr('id', existingId);
        }
        else parent.append(self.Elements.Me);

        return self.initializeHtml();
    };

    this.generateHtml = function () {
        var template = self.getDefaultTemplate();
        if (!template)
            return null;

        template.Compiled = template.Compiled || Handlebars.compile($("#" + template.Id).html());
        if (!template.Compiled)
            return null;

        var html = template.Compiled({
            Control: self
        });

        return html;
    };

    this.getTemplate = function (name) {
        if (!self.Options.Templates || !self.Options.Templates.length)
            return null;

        return self.Options.Templates.findFirstKeyValue('Name', name);
    };

    this.getDefaultTemplate = function () {
        if (!self.Options.Templates || !self.Options.Templates.length)
            return null;

        var defaultTemplate = self.Options.Templates.findFirstKeyValue('IsDefault', true) || self.Options.Templates[0];

        return defaultTemplate;
    };

    this.getChildrenContainer = function () {
        if (!self.Elements.Me)
            return null;

        var main = self.Elements.Me.find('[role="main"]:first');
        if (!main.length)
            main = self.Elements.Me;

        return main;
    };

    this.setContent = function (content) {
        self.Options.Content = content;

        var childrenContainer = self.getChildrenContainer();
        if (!childrenContainer)
            return;

        childrenContainer.empty().append(content);

        return self;
    };

    this.disable = function () {
        setEnabled(false);
    };

    this.enable = function () {
        setEnabled(true);
    };

    var setEnabled = function (isEnabled) {
        if (!self.Elements.Me)
            return;

        self.Options.IsEnabled = isEnabled;

        if (isEnabled)
            self.Elements.Me.removeAttr('disabled');
        else self.Elements.Me.attr('disabled', 'disabled');
    };

    this.getChildren = function () { return null; }

    this.getIdentifier = function () { return 'Control'; }

    this.setValue = function (value, property, options) {

    };

    var transferAttributes = function (source, destination) {
        if (!source || !destination)
            return;

        var escapeAttributes = ["data-control", "data-options", "data-source-options"];

        var attributes = source.attrs();
        for (var i = 0; i < attributes.length; i++) {
            var a = attributes[i];
            if (!a.Name || escapeAttributes.findFirstIndex(function (item) { return item == a.Name; }) >= 0)
                continue;

            if (a.Name.toLowerCase() == 'class') {
                var classes = source.attr('class').split(' ');
                for (var j = 0; j < classes.length; j++) {
                    var c = classes[j];
                    if (!c)
                        continue;

                    if (!destination.hasClass(c))
                        destination.addClass(c);
                }
            }
            else {
                destination.attr(a.Name, a.Value);
            }
        }
    };

    if (!isInherited)
        self.initialize();
};