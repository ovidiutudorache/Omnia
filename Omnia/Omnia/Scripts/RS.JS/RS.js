var RS = function () {
    var self = this;

    this.initialize = function () {
        $(document).ready(function (e) {
            if (RS.Controls) {
                RS.Controls.ControlsGenerator.generateControlsInContainer();
                RS.Controls.ControlsGenerator.listenForControls();
            }

            self.ready();
        });

        return self;
    };

    this.ready = function () { };
};

RS = new RS().initialize();