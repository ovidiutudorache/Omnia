$.validator.defaults.ignore = '';

//--- BEGIN nonalphanumeric ---

$.validator.addMethod('nonalphanumeric', function(value, element, param) {
    var isValid = false;
    if (value.length == 0) {
        isValid = true;
    } else {
        var nonAlphaNumericStrippedValue = value.removeNonAlphaNumeric();
        isValid = nonAlphaNumericStrippedValue.length == value.length;
    }

    return isValid;
});

$.validator.unobtrusive.adapters.add('nonalphanumeric', {}, function(options) {
    options.rules['nonalphanumeric'] = true;
    options.messages['nonalphanumeric'] = options.message;
});

//--- END nonalphanumeric ---

//--- BEGIN nospaces ---

$.validator.addMethod('nospaces', function(value, element, param) {
    var isValid = false;
    if (value.length == 0) {
        isValid = true;
    } else {
        isValid = true;
        for (var i = 0; i < value.length; i++) {
            if (value[i] == ' ') {
                isValid = false;
                break;
            }
        }
    }

    return isValid;
});

$.validator.unobtrusive.adapters.add('nospaces', {}, function(options) {
    options.rules['nospaces'] = true;
    options.messages['nospaces'] = options.message;
});

//--- END nospaces ---