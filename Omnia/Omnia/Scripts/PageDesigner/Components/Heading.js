var PageComponents = PageComponents || {};
PageComponents.Heading = {
    Id: 'Heading',
    Name: 'Heading',
    Html: "<h3 class='component'>Heading</h3>",
    detect: function (el) {
        return el.prop('tagName').substr(0, 1).toLowerCase() == 'h';
    },
    IsListed: true,
    Designer: {
        Properties: [
            {
                Name: 'Size',
                Type: DesignerPropertiesTypes.Select,
                Values: [
                    { Value: 1, Label: '1' },
                    { Value: 2, Label: '2' },
                    { Value: 3, Label: '3' },
                    { Value: 4, Label: '4' },
                    { Value: 5, Label: '5' },
                    { Value: 6, Label: '6' }
                ],
                onChange: function (el, value) {
                    var newHeading = $('<h' + value + ' class="selectable">' + $(el)[0].innerHTML + '</h' + value + '>');
                    newHeading.data('Component', el.data('Component'));
                    el.replaceWith(newHeading);
                    newHeading.trigger('mousedown');
                },
                set: function (el, control) {
                    var headingValue = el.prop('tagName').substr(1);
                    control.val(headingValue);
                }
            },
            {
                Name: 'Content',
                Type: DesignerPropertiesTypes.Text,
                onChange: function (el, value) {
                    el.html(value);
                },
                set: function (el, control) {
                    control.val(el.html());
                }
            }
        ]
    },
    getComponent: function (el) {
        if (!el)
            return null;

        return {
            Content: el.text()
        };
    },
    generateHtml: function (serverComponent, inDesign) {
        if (!serverComponent)
            return null;

        var el = $(this.Html);
        el.text(serverComponent.Content);

        return el;
    }
};