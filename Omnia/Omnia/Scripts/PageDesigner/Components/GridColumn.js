var PageComponents = PageComponents || {};
PageComponents.GridColumn = {
    Id: 'GridColumn',
    Name: 'Grid column',
    Html: $("#component-grid-column-template").html(),
    AllowedClasses: 'row',
    detect: function (el) {
        return el.parent().hasClass('row');
    },
    IsListed: false,
    getComponent: function (el) {
        if (!el)
            return null;

        return {
            Span: UI.getColumnSpan(el),
            Children: ComponentsRepository.getComponents(el)
        };
    },
    generateHtml: function (serverComponent, inDesign) {
        if (!serverComponent)
            return null;

        var el = $(this.Html);
        el.addClass('col-md-' + serverComponent.Span);

        if (serverComponent.Children) {
            for (var i = 0; i < serverComponent.Children.length; i++) {
                var childServerComponent = serverComponent.Children[i];
                var html = ComponentsRepository.generateHtml(childServerComponent, inDesign);
                if (html)
                    el.append(html);
            }
        }

        return el;
    }
};