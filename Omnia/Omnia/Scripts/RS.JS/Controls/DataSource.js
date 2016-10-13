RS.Controls.DataSource = function (options, isInherited) {
    var self = this;

    this.Options = {
        Data: null,
        RemoteCall: {
            Url: null,
            Type: 'GET',
            Parameters: null
        },
        Paging: {
            IsEnabled: true
        },
        IsCaseSensitive: false,
        IsComplex: false
    };

    if (options)
        this.Options = $.extend(this.Options, options);

    this.PubSub = null;
    this.IsLoading = false;
    this.PageIndex = -1;
    this.FilteredData = null;
    this.HasMoreData = true;

    var lastPageIndexToLoad = -1;

    this.initialize = function () {
        self.PubSub = new RS.PubSub();
        self.PubSub.addEvent('refresh');
        self.PubSub.addEvent('add');
        self.PubSub.addEvent('remove');
        self.PubSub.addEvent('clear');

        return self;
    };

    this.goToNextPage = function (callback) {
        if (!self.HasMoreData)
            return;

        self.goToPage(self.PageIndex + 1, callback);
    };

    this.goToPage = function (pageIndex, callback) {
        options = options || {};
        options.PageIndex = pageIndex;
        self.loadData(options, callback);
    };

    this.refresh = function (options, callback) {
        if (self.Options.Data && self.Options.RemoteCall.Url)
            self.clear({
                IsRefresh: true
            });

        options = options || {};
        options.IsRefresh = true;
        self.loadData(options, callback);
    };

    this.loadData = function (options, callback) {
        if (self.hasRemoteCall())
            self.getRemoteData(options, function (response) { onGotData(options, response); if (callback) callback(); });
        else self.getLocalData(options, function (response) { onGotData(options, response); if (callback) callback(); });
    };

    this.hasRemoteCall = function () {
        return self.Options.RemoteCall.Url != null;
    };

    this.clear = function (options) {
        self.PageIndex = -1;
        self.Options.Data = null;
        self.HasMoreData = true;

        self.PubSub.triggerEvent('clear', {
            Source: self,
            Options: options
        });
    };

    this.addItem = function (items, index) {
        if (!items)
            return self;

        self.Options.Data = self.Options.Data || [];

        index = Math.max(0, Math.min(self.Options.Data.length - 1, index || self.Options.Data.length - 1));

        if (items instanceof Array) {
            for (var i = 0; i < items.length; i++)
                self.Options.Data.splice(index + i, 0, items);
        }
        else self.Options.Data.splice(index, 0, items);

        self.PubSub.triggerEvent('add', {
            Source: self,
            Items: items,
            Index: index
        });

        return self;
    };

    this.removeItem = function (index, number) {
        if (!self.Options.Data)
            return self;

        number = number || 1;

        self.Options.Data.splice(index, number);

        self.PubSub.triggerEvent('add', {
            Source: self,
            Index: index,
            Number: number
        });

        return self;
    };

    this.getParameter = function (name) {
        if (!self.Options.RemoteCall || !self.Options.RemoteCall.Parameters || !name)
            return;

        var p = self.Options.RemoteCall.Parameters.findFirst(function (item, index) { return item.Name == name; });

        return p;
    };

    this.setParameter = function (name, value, model) {
        self.Options.RemoteCall.Parameters = setParameterValue(self.Options.RemoteCall.Parameters, name, value, model);
    };

    this.buildUrl = function () {
        if (!self.Options.RemoteCall || !self.Options.RemoteCall.Url)
            return null;

        if (!self.Options.RemoteCall.Parameters || self.Options.RemoteCall.Type == "GET")
            return self.Options.RemoteCall.Url;

        var url = self.Options.RemoteCall.Url + "?";

        for (var i = 0; i < self.Options.RemoteCall.Parameters.length; i++) {
            var p = self.Options.RemoteCall.Parameters[i];
            if (!p)
                continue;

            if (p.Value || (!p.Value && p.IsMandatory))
                url += p.Name + "=" + (p.Value || "") + "&";
        }

        return url;
    };

    var setParameterValue = function (parameters, name, value, model) {
        if (!name)
            return parameters;

        if (!parameters)
            parameters = [];

        var found = false;
        for (var i = 0; i < parameters.length; i++) {
            var p = parameters[i];
            if (p.Name == name || p.Binding == name || (p.Binding && p.Binding.startsWith(name + '.'))) {
                if (p.Binding && model)
                    value = RS.Utils.getValue(model, p.Binding);

                p.Value = value;
                found = true;
            }
        }

        if (!found)
            parameters.push({
                Name: name,
                Value: value
            });

        return parameters;
    };

    this.getRemoteData = function (options, callback) {
        if (!self.Options.RemoteCall)
            return;

        if (!areRequiredParametersValid()) {
            self.clear();
            return;
        }

        self.IsLoading = true;

        var data = getDataFromParameters(self.Options.RemoteCall.Parameters);

        if (self.Options.Paging.IsEnabled) {
            data = data || [];
            var pageIndexRequired = options ? Math.max(0, options.PageIndex || self.PageIndex) : 0;
            if (self.Options.IsComplex) {
                data.Parameters = data.Parameters || [];
                data.Parameters.push({
                    Name: 'pageIndex',
                    Value: pageIndexRequired
                });
            }
            else data.pageIndex = pageIndexRequired;

            lastPageIndexToLoad = pageIndexRequired;
        };

        var url = self.buildUrl();

        if (url)
            RS.Remote.call(self.Options.RemoteCall.Url, data, function (response) {
                if (self.Options.Paging.IsEnabled)
                    self.PageIndex = Math.max(self.PageIndex, data.pageIndex || 0);

                if (data.pageIndex == lastPageIndexToLoad)
                    self.IsLoading = false;

                if (callback)
                    callback(response);
            }, self.Options.RemoteCall.Type);
    };

    var areRequiredParametersValid = function () {
        if (!self.Options.RemoteCall.Parameters)
            return true;

        var p = self.Options.RemoteCall.Parameters.findFirst(function (item) { return item.IsMandatory && !item.Value; });

        return p == null;
    };

    var getDataFromParameters = function (parameters) {
        if (!parameters)
            return null;

        var data = {};
        for (var i = 0; i < parameters.length; i++) {
            var p = parameters[i];

            if (self.Options.IsComplex) {
                data.Parameters = data.Parameters || [];
                data.Parameters.push({
                    Name: p.Name,
                    Value: p.Value
                });
            }
            else data[p.Name] = p.Value;
        }

        return data;
    };

    this.getLocalData = function (options, callback) {
        var data = self.Options.Data;

        if (data) {
            if (self.Options.IsComplex) {
                data = self.Options.Data && self.Options.Data.length ? self.Options.Data[0] : null;
            }

            var term = self.getParameter('term');
            if (term) {
                if (!self.Options.IsCaseSensitive)
                    term = term.toLowerCase();

                data = $.grep(data, function (item, index) { return item && item.Text && ((self.Options.IsCaseSensitive && item.Text.indexOf(term) > -1) || (!self.Options.IsCaseSensitive && item.Text.toLowerCase().indexOf(term) > -1)); });
            }
        }

        if (callback)
            callback(data);

        return data;
    };

    this.getDataSet = function () {
        if (!self.Options.Data)
            return null;

        return self.Options.IsComplex ? (self.Options.Data && self.Options.Data.length ? self.Options.Data[0].DataSet : null) : self.Options.Data;
    };

    this.getItemFromRow = function (row) {
        if (!row || !row.Cells || !self.Options.IsComplex)
            return null;

        var data = self.getLocalData();
        if (!data || !data.Header || !data.Header.Columns)
            return null;

        var item = {};
        for (var i = 0; i < Math.min(row.Cells.length, data.Header.Columns.length); i++) {
            var c = data.Header.Columns[i];
            if (!c)
                continue;

            item[c.Name] = row.Cells[i].Value;
        }

        return item;
    };

    var onGotData = function (options, response) {
        self.Options.Data = self.Options.Data || [];

        if (options && options.IsRefresh)
            self.FilteredData = [];

        self.FilteredData = self.FilteredData || [];

        if (self.hasRemoteCall() && response) {
            var gotMoreData = false;
            if (response instanceof Array) {
                for (var i = 0; i < response.length; i++) {
                    self.Options.Data.push(response[i]);
                    self.FilteredData.push(response[i]);
                }

                gotMoreData = response.length > 0;
            }
            else {
                self.Options.Data.push(response);
                self.FilteredData.push(response[i]);

                gotMoreData = response[i];
            }
        }

        if (!gotMoreData)
            self.HasMoreData = false;

        if (!self.Options.RemoteCall.Url) {
            self.FilteredData = response;
        }

        self.PubSub.triggerEvent('refresh', {
            Source: self,
            Options: options,
            Data: response
        });
    };

    if (!isInherited)
        self.initialize();
};