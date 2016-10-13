RS.Controls.Container = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [{
            IsDefault: true,
            Id: 'container-template'
        }]
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Container.superclass.constructor.call(this, self.Options, container, true);

    this.getChildrenContainer = function () {
        if (!self.Elements.Me)
            return null;

        return self.Elements.Me.find('[role="main"]:first');
    };

    this.getIdentifier = function () { return 'Container'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Container, RS.Controls.Control);