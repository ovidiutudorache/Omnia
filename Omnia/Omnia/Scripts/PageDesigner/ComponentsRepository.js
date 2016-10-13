var ComponentsRepository = {
    All: [],
    getById: function (id) {
        for (var i = 0; i < ComponentsRepository.All.length; i++) {
            var c = ComponentsRepository.All[i];
            if (c.Id == id)
                return c;
        }

        return null;
    },
    detect: function (el) {
        if (!el)
            return null;

        for (var i = 0; i < ComponentsRepository.All.length; i++) {
            var c = ComponentsRepository.All[i];
            if (c.detect && c.detect(el))
                return c;
        }

        return null;
    },
    registerComponent: function (component) {
        ComponentsRepository.All.push(component);
    },
    getComponent: function (el) {
        var clientComponent = ComponentsRepository.detect(el);
        var component = clientComponent && clientComponent.getComponent ? clientComponent.getComponent(el) : null;
        if (component) {
            component.Type = clientComponent.Id;
        }

        return component;
    },
    getComponents: function (container) {
        if (!container)
            return null;

        var children = new Array();
        container.find('> .component').each(function () {
            var el = $(this);
            var component = ComponentsRepository.getComponent(el);
            if (component)
                children.push(component);
        });

        return children;
    },
    generateHtml: function (serverComponent, inDesign) {
        if (!serverComponent || !serverComponent.Type)
            return null;

        var identifiedComponent = ComponentsRepository.getById(serverComponent.Type);
        if (!identifiedComponent || !identifiedComponent.generateHtml)
            return null;

        var clientComponent = identifiedComponent.generateHtml(serverComponent, inDesign);
        if (!clientComponent)
            return null;

        if (inDesign) {
            if (!clientComponent.hasClass('component'))
                clientComponent.addClass('component');
            clientComponent.attr('data-in-designer', 'true');
        }
        else {
            clientComponent.removeClass('component');
            clientComponent.removeAttr('data-in-designer');
        }

        return clientComponent;
    }
};

for (var c in PageComponents) {
    ComponentsRepository.registerComponent(PageComponents[c]);
};