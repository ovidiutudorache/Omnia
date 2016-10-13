Handlebars.registerHelper('getColumnValue', function (item, column, options) {
    var value = item[column.Name];

    if (value && column.Type == 'DateTime') {
        value = value.parseDate();
        value = value.format(column.Format);
    }

    return value;
});

Handlebars.registerHelper('showProperty', function (control, item, options) {
    return item[control.Options.DisplayName || 'Text'];
});

Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});

Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper("random", function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
});

Handlebars.registerHelper('getCellValue', function (item, column, options) {
    var value = item && item.Cells && item.Cells.length > options.data.index ? item.Cells[options.data.index].Value : null;

    if (value && column.Type == 'DateTime') {
        value = value.parseDate();
        value = value.format(column.Format);
    }

    return value;
});

Handlebars.registerHelper('getDataSetColumnValue', function (control, row, options) {
    if (!control || !control.Options || !control.Columns || isNaN(control.Options.DisplayColumnIndex))
        return null;

    var value = row && row.Cells && row.Cells.length > control.Options.DisplayColumnIndex ? row.Cells[control.Options.DisplayColumnIndex].Value : null;
    var column = control.Columns[control.Options.DisplayColumnIndex];

    if (value && column.Type == 'DateTime') {
        value = value.parseDate();
        value = value.format(column.Format);
    }

    return value;
});