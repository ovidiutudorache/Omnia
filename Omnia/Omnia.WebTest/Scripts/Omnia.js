var Omnia = Omnia || new function () {
    var self = this;
    var baseUrl = 'http://localhost/omnia/';

    this.ApplicationId = '';

    this.initialize = function (applicationId) {
        self.ApplicationId = applicationId;

        return self;
    };

    this.loginExternalProvider = function (provider, state) {
        provider = provider || '';
        var url = baseUrl + 'authentication/ExternalLogin?applicationId=' + self.ApplicationId + "&provider=" + provider;
        if (state)
            url += '&state=' + state

        window.location = url;
    };
};