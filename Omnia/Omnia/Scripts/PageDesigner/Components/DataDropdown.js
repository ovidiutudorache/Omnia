var PageComponents = PageComponents || {};
PageComponents.DataDropdown = {
    Id: 'DataDropdown',
    Name: 'DataDropdown',
    Html: "<select class='form-control' data-role='DataDropdown'><option></option></select>",
    //AllowedClasses: 'col-md-1 col-md-2 col-md-3 col-md-4 col-md-5 col-md-6 col-md-7 col-md-8 col-md-9 col-md-10 col-md-11 col-md-12',
    detect: function (el) {
        return el.attr('data-role') == 'DataDropdown';
    },
    IsListed: true,
    Designer: {
        Properties: [
            {
                Name: 'DisplayColumn',
                Type: DesignerPropertiesTypes.Text,
                DefaultValue: "Name",
                IsOption: true
            },
            {
                Name: 'SelectText',
                Type: DesignerPropertiesTypes.Text,
                DefaultValue: "Select option",
                IsOption: true,
                onChange: function (el, value) {
                   el.find('option:first').html(value);
                },
                set: function (el, control, component, value) {
                    control.val(value);
                    this.onChange(el, value);
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