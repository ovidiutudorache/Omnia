RS.Controls.ModalButton = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        IsDismiss: false,
        Callback: null
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.ModalButton.superclass.constructor.call(this, self.Options, container, true);

    this.getIdentifier = function () { return 'ModalButton'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.ModalButton, RS.Controls.Button);