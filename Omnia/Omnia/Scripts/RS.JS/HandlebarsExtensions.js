Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2)
        return options.fn(this);
		
    return options.inverse(this);
});

Handlebars.registerHelper('disabled', function (isDisabled, inverse, options) {
    if (inverse)
        isDisabled = !isDisabled;

    return isDisabled ? 'disabled="disabled"' : null;
});

Handlebars.registerHelper('checked', function (isChecked, inverse, options) {
    if (inverse)
        isChecked = !isChecked;

    return isChecked ? 'checked="checked"' : null;
});

Handlebars.registerHelper('dateFormat', function (date, format, options) {
    if (typeof format === 'object' || format === null)
        format = 'mmm d, yyyy HH:MM';

    return date ? date.parseDate().format(format) : null;
});

Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});

Handlebars.registerHelper('log', function (variable) {
    console.log(variable);
});

Handlebars.registerHelper("random", function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
});