RS.Remote = (function () {
    var self = this;

    var apiToken = null;
    var baseUrl = null;

    var setToken = function (value) {
        apiToken = value
    };

    var setBaseUrl = function (value) {
        baseUrl = value
    };

    return {
        call: function (url, data, callback, type, processData, dataType, contentType) {
            url = (baseUrl || "") + url;
            type = type || 'GET';
            var dataToSend = data && type == 'POST' ? JSON.stringify(data) : data;

            if (processData == null || processData == undefined)
                processData = !type || type == 'GET';

            $.ajax({
                type: type,
                dataType: "json",
                async: true,
                cache: false,
                url: url,
                data: dataToSend,
                contentType: contentType || "application/json; charset=utf-8",
                dataType: dataType || null,
                processData: processData,
                success: function (response) {
                    if (callback)
                        callback(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var defaultErrorMessage = "An error occured on the server. Don't worry, it's not your fault.";
                    var errorMessage = null;

                    if (jqXHR && jqXHR.responseText) {
                        try {
                            var response = JSON.parse(jqXHR.responseText);
                            if (response.Error)
                                errorMessage = response.Error;
                        }
                        catch (e) {
                            errorMessage = jqXHR.responseText;
                        }
                    }

                    if (!errorMessage && errorThrown && errorThrown.message)
                        errorMessage = errorThrown.message;

                    var errorMessage = errorMessage || defaultErrorMessage;

                    if (callback)
                        callback({
                            Error: errorMessage
                        });
                },
                beforeSend: function (jqXHR, settings) {
                    if (apiToken && apiToken.length) {
                        jqXHR.setRequestHeader('Authentication-Token', apiToken);
                    }
                }
            });
        },
        setToken: function (value) { setToken(value); },
        setBaseUrl: function (value) { setBaseUrl(value); }
    };
})();