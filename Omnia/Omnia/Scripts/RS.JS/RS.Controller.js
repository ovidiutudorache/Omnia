RS.Controller = function (name, model) {
    var self = this;

    this.Name = name;
    this.Model = model;
    this.BoundElements = null;
    this.PubSub = new RS.PubSub();

    var initialize = function () {
        self.PubSub.addEvent('change');
    };

    this.bindElement = function (boundElement) {
        if (!boundElement)
            return;

        self.BoundElements = self.BoundElements || [];
        self.BoundElements.push(boundElement);

        if (boundElement.DataBindExpression) {
            var control = boundElement.Element.getControl();

            if (control && typeof control == 'object') {
                control.PubSub.addListener('change', function () {
                    boundElement.solve(self, {
                        IsSource: true
                    });
                });
            }
            else {
                boundElement.Element.bind(boundElement.getEventsTriggeringChange(), function () {
                    boundElement.solve(self, {
                        IsSource: true
                    });
                });
            }
        }

        if (self.Model)
            boundElement.solve(self);
    };

    this.setModel = function (model) {
        this.Model = model;
        if (!model || !model.PubSub)
            return;

        solveBoundElements();
        model.PubSub.addListener('change', function (e) {
            self.PubSub.triggerEvent('change', e);
            solveBoundElements(e);
        });
    };

    var solveBoundElements = function (e) {
        if (!self.BoundElements || !self.BoundElements.length)
            return;

        for (var i = 0; i < self.BoundElements.length; i++) {
            var boundElement = self.BoundElements[i];
            boundElement.solve(self, e);
        }
    };

    this.refresh = function () {
        solveBoundElements();
    };

    initialize();
};