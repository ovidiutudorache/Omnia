var BlockHover = function (container, parentContainer, options) {
    var self = this;

    var defaultOptions = {
        Enabled: true,
        ShowOver: false
    };

    var elements = {
        block: null,
        options: null
    };

    var templates = {
        primary: Handlebars.compile($("#block-hover-template").html())
    };

    var maximumColumnWidth = 12;
    var maximumColumnWidthToAdd = 4;

    var selectedElement = null;
    var lastSortableRow = null;

    this.initialize = function () {
        container.on('mouseenter', '.selectable', function () {
            if (!defaultOptions.Enabled)
                return true;

            var el = $(this);
            return self.goToElement($(this));
        });

        render();

        return self;
    };

    this.enable = function () {
        defaultOptions.Enabled = true;
    };

    this.disable = function () {
        defaultOptions.Enabled = false;
        elements.block.hide();
        elements.options.hide();
    };

    this.goToElement = function (el) {
        if (selectedElement)
            selectedElement.removeClass('hovered');

        selectedElement = el;
        selectedElement.addClass('hovered');

        if (el.hasClass('row'))
            elements.options.find('.add-block').show();
        else elements.options.find('.add-block').hide();

        if (el.parent().hasClass('row'))
            elements.options.find('.increase-size, .decrease-size').show();
        else elements.options.find('.increase-size, .decrease-size').hide();

        elements.options.css({
            left: (el.offset().left - parentContainer.offset().left) + el.outerWidth() - elements.options.outerWidth(),
            top: (el.offset().top - parentContainer.offset().top)
        }).show();

        if (el.parent().hasClass('page-container'))
            elements.options.hide();
        else elements.options.show();

        var component = el.data('Component');
        if (!component)
            return true;

        var name = component ? component.Name : el.attr('class');

        elements.block.find('[role="name"]').html(name);

        if (defaultOptions.ShowOver)
            elements.block.css({
                left: (el.offset().left - parentContainer.offset().left),
                top: (el.offset().top - parentContainer.offset().top)
            }).show();

        return false;
    };

    var render = function () {
        var el = $(templates.primary());
        parentContainer.append(el);

        elements.block = el.find('.hover-block:first');
        elements.options = el.find('.hover-block-options:first');

        elements.options.find('.remove-block').click(function () {
            if (!selectedElement || selectedElement.parent().hasClass('page-container'))
                return false;

            selectedElement.remove();
            elements.block.hide();
            elements.options.hide();
        });

        elements.options.find('.add-block').click(function () {
            if (!selectedElement)
                return false;

            addBlock(selectedElement);
        });

        elements.options.find('.increase-size').click(function (e) {
            if (!selectedElement)
                return false;

            var maximize = e.ctrlKey;
            increaseSize(selectedElement, false, maximize);
        });

        elements.options.find('.decrease-size').click(function () {
            if (!selectedElement)
                return false;

            increaseSize(selectedElement, true);
        });
    };

    var increaseSize = function (el, negative, maximize) {
        if (!el || !el.parent().hasClass('row'))
            return;

        var totalLength = getRowWidth(el.parent());
        var width = getColumnWidth(el);

        var delta = 1;
        if (!negative && maximize)
            delta = maximumColumnWidth - totalLength;

        if ((totalLength == 0 && negative) || (totalLength >= maximumColumnWidth && !negative))
            return;

        if ((width == 1 && negative) || (totalLength >= maximumColumnWidth && !negative))
            return;

        el.removeClass('col-md-' + width);

        var classToAdd = 'col-md-' + (negative ? (width - delta) : (width + delta));
        el.addClass(classToAdd);

        self.goToElement(selectedElement);
    };

    var addBlock = function (el) {
        if (!el || !el.hasClass('row'))
            return;

        var totalLength = getRowWidth(el);

        if (totalLength >= maximumColumnWidth)
            return;

        var leftLength = Math.min(maximumColumnWidth - totalLength, maximumColumnWidthToAdd);

        var columnComponent = ComponentsRepository.getById('GridColumn');
        var column = $(columnComponent.Html);
        column.addClass('col-md-' + leftLength);
        selectedElement.append(column);

        RS.Event.sendEvent(parentContainer, 'addedColumn', {
            Row: selectedElement
        });
    };

    var getRowWidth = function (el) {
        var totalLength = 0;
        el.find('> div').each(function () {
            var col = $(this);
            totalLength += getColumnWidth(col);
        });

        return totalLength;
    };

    var getColumnWidth = function (col) {
        var classes = col.attr('class').split(' ');
        var length = 0;
        for (var i = 0; i < classes.length; i++) {
            var c = classes[i];
            if (!c || c.indexOf('col-') != 0)
                continue;

            var splits = c.split('-');
            length += parseInt(splits[splits.length - 1], 10);
        }

        return length;
    };
};