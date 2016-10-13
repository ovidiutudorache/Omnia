RS.HandlebarsRenderer = (function () {

    return {
        Render: function (data, template, container, callback, append) {
            data = data || [];
            var html = template({ data: data });

            if (append)
                container.append(html);
            else container.html(html);

            if (callback)
                callback();
        }
    };
})();