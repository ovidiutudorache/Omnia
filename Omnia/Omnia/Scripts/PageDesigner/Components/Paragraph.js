var PageComponents = PageComponents || {};
PageComponents.Paragraph = {
    Id: 'Paragraph',
    Name: 'Paragraph',
    Html: "<p class='component'>Content</p>",
    IsListed: true,
    detect: function (el) {
        return el.prop('tagName').toLowerCase() == 'p';
    },
    Designer: {
        Properties: [
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