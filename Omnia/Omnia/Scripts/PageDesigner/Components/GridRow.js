var PageComponents = PageComponents || {};
PageComponents.GridRow = {
    Id: 'GridRow',
    Name: 'Grid row',
    HelperHtml: $("#component-grid-row-template").html(),
    AllowedClasses: 'container container-fluid',
    detect: function (el) {
        return el.hasClass('row');
    },
    IsListed: true,
    getComponent: function (el) {
        if (!el)
            return null;

        return {
            Columns: ComponentsRepository.getComponents(el)
        };
    },
    generateHtml: function (serverComponent, inDesign) {
        if (!serverComponent)
            return null;

        var el = $(this.HelperHtml);
        if (serverComponent.Columns) {
            for (var i = 0; i < serverComponent.Columns.length; i++) {
                var columnServerComponent = serverComponent.Columns[i];
                var html = ComponentsRepository.generateHtml(columnServerComponent, inDesign);
                if (html)
                    el.append(html);
            }
        }

        return el;
    }
};