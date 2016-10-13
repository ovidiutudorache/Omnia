RS.Controls.DateTimePicker = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Templates: [
             {
                 IsDefault: true,
                 Id: 'datetimepicker-template'
             }
        ],
        Hours: {
            Enabled: false
        }
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    var proxyOptions = {
        format: self.Options.Hours.Enabled ? 'DD/MM/YYYY hh:mm' : 'DD/MM/YYYY'
    };

    RS.Controls.DateTimePicker.superclass.constructor.call(this, self.Options, container, true);

    this.Elements.Me = null;
    this.Elements.Picker = null;
    this.SelectedDate = null;

    var proxyControl = null;

    this.initialize = override(self.initialize, function () {
        self.PubSub.addEvent('select');

        return self;
    });

    this.setDate = function (date) {
        self.SelectedDate = date;
        proxyControl.date(self.SelectedDate);
    };

    this.disable = override(self.disable, function () {
        if (!proxyControl)
            return self;

        proxyControl.disable();

        return self;
    });

    this.enable = override(self.enable, function () {
        if (!proxyControl)
            return self;

        proxyControl.enable();

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        if (!self.Elements.Me)
            return self;

        self.Elements.Picker = self.Elements.Me.attr('role') == 'datetimepicker' ? self.Elements.Me : self.Elements.Me.find('[role="datetimepicker"]:first');

        self.Elements.Picker.datetimepicker(proxyOptions);
        self.Elements.Picker.on("dp.change", function (e) {
            self.SelectedDate = e.date ? e.date.toDate() : null;

            self.PubSub.triggerEvent('select', {
                Source: self,
                Data: self.SelectedDate
            });
        });

        proxyControl = self.Elements.Picker.data("DateTimePicker");

        self.Elements.Picker.find('input:first').bind('focusin', function () { proxyControl.show(); });
        proxyControl.date(self.SelectedDate);

        if (self.Options.IsEnabled)
            self.enable();
        else self.disable();

        return self;
    });

    this.getIdentifier = function () { return 'DateTimePicker'; }

    if (!isInherited) {
        self.initialize();
        self.appendTo(container, true);
    }
};
extend(RS.Controls.DateTimePicker, RS.Controls.Control);