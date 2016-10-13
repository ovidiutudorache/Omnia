RS.Logger = function () {
    var self = this;

    var defaults = {
        BackgroundColor: '#fff',
        TextColor: '#333',
        Category: {
            Background: '#fff',
            Text: 'green'
        },
        IsOn: false
    };

    this.Options = defaults;

    var log = function (logType, message, details, category) {
        if (!defaults.IsOn)
            return;

        if (!message)
            return;

        if (category)
            writeToConsole(category + ':', defaults.Category.Background, defaults.Category.Text);

        writeToConsole(message);
        if (details)
            writeToConsole(details);
    };

    var writeToConsole = function (message, backgroundColor, textColor) {
        backgroundColor = backgroundColor || defaults.BackgroundColor;
        textColor = textColor || defaults.TextColor;

        if (typeof message == "object") {
            console.log(message);
        } else {
            console.log("%c" + message, "color:" + textColor + ";font-weight:bold; background-color: " + backgroundColor + ";");
        }
    };

    this.logInfo = function (message, details, category) { log(RS.LogTypes.Info, message, details, category); }
    this.logSucces = function (message, details, category) { log(RS.LogTypes.Success, message, details, category); }
    this.logWarning = function (message, details, category) { log(RS.LogTypes.Warning, message, details, category); }
    this.logError = function (message, details, category) { log(RS.LogTypes.Error, message, details, category); }
};

RS.Logger = new RS.Logger();