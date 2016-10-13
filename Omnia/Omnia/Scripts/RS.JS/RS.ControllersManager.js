RS.ControllersManager = function () {
    var self = this;

    this.Controllers = {};

    this.initialize = function () {
        getBindings();

        $(document).on('DOMNodeInserted', function (e) {
            var elementInserted = $(e.target);
            getBindings(elementInserted.parent());
        });
    };

    this.registerModel = function (name, instance) {
        self.Controllers[name] = self.Controllers[name] || new RS.Controller();
        var controller = self.Controllers[name];
        controller.Name = name;

        if (instance) {
            if (!instance.PubSub) {
                instance.PubSub = new RS.PubSub();
                instance.PubSub.addEvent('change');
            }
        }

        controller.setModel(instance);

        return controller;
    };

    var getBindings = function (container) {
        container = container || $(document);

        var children = container.find("*");
        children.each(function () {
            var el = $(this);

            var controller = self.getElementController(el, true);
            if (!controller)
                return;

            var boundElement = null;

            if (!el.data('in-binding') && el.attr('data-bind')) {
                boundElement = new RS.BoundElement(el);
                el.data('in-binding', true);
            }
            else if (!el.data('out-binding') && (el.text() || '').indexOf('{{') > -1) {
                boundElement = new RS.BoundElement(el);
                el.data('out-binding', true);
            }
            else if (!el.data('visibility-binding') && el.attr('data-bind-visible')) {
                boundElement = new RS.BoundElement(el);
                el.data('visibility-binding', true);
            }

            if (boundElement)
                controller.bindElement(boundElement);

            if (!el.data('click-binding')) {
                var clickBinding = el.attr('data-bind-click');
                if (clickBinding) {
                    el.click(function () {
                        var controller = self.getElementController(el);
                        if (!controller || !controller.Model || !controller.Model[clickBinding] || typeof controller.Model[clickBinding] != 'function')
                            return;

                        controller.Model[clickBinding](el);

                        return false;
                    });
                }

                el.data('click-binding', true);
            }
        });
    };

    this.getElementController = function (el, registerIfNotExists) {
        if (!el)
            return null;

        var existingController = el.data('Controller');
        if (existingController)
            return existingController;

        var controller = el.parents('[data-controller]:first');
        if (!controller.length)
            return null;

        var controllerName = controller.attr('data-controller');
        if (!controllerName)
            return null;

        existingController = self.Controllers[controllerName];
        if (!existingController && registerIfNotExists)
            existingController = self.registerModel(controllerName);

        el.data('Controller', existingController);

        return existingController;
    };

    self.initialize();
};
RS.ControllersManager = new RS.ControllersManager();