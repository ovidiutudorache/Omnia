var PageComponents = PageComponents || {};
PageComponents.Container = {
    Id: 'Container',
    Name: 'Container',
    HelperHtml: $("#component-container-template").html(),
    AllowedClasses: 'col-md-1 col-md-2 col-md-3 col-md-4 col-md-5 col-md-6 col-md-7 col-md-8 col-md-9 col-md-10 col-md-11 col-md-12',
    detect: function (el) {
        return el.hasClass('container') || el.hasClass('container-fluid');
    },
    IsListed: false,
    Designer: {
        Properties: [
            {
                Name: 'Type',
                Type: DesignerPropertiesTypes.Select,
                Values: [
                    { Value: 1, Label: 'Fixed width' },
                    { Value: 2, Label: 'Full width' },
                ],
                onChange: function (el, value) {
                    el.removeClass('container').removeClass('container-fluid');
                    if (value == 1)
                        el.addClass('container');
                    else el.addClass('container-fluid');
                },
                set: function (el, control) {
                    control.val(el.hasClass('container-fluid') ? 2 : 1);
                }
            }
        ]
    },
    getComponent: function (el) {
        if (!el)
            return null;

        return {
            WidthType: el.hasClass('container-fluid') ? WidthTypes.FullWidth : WidthTypes.FixedWidth,
            Children: ComponentsRepository.getComponents(el)
        };
    },
    generateHtml: function (serverComponent, inDesign) {
        if (!serverComponent)
            return null;

        var el = $(this.HelperHtml);
        switch (serverComponent.WidthType) {
            case WidthTypes.FullWidth: el.addClass('container-fluid'); break;
            case WidthTypes.FixedWidth: el.addClass('container'); break;
        }

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