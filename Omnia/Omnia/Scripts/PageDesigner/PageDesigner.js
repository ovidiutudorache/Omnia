var PageDesigner = function (container, page) {
    var self = this;

    var elements = {
        controlsContainer: container.find(".controls-container"),
        pageContainer: container.find('.page-container'),
        pageContainerParent: container.find('.page-container-parent'),
        propertiesContainer: container.find('.properties-container'),
        pageName: container.find('.page-name'),
        componentsPanelContainer: container.find('.components-panel-container'),
        propertiesPanelContainer: container.find('.properties-panel-container'),
        designerPanelContainer: container.find('.designer-panel-container')
    };

    var templates = {
        propertiesDesigner: Handlebars.compile($("#properties-designer-template").html())
    };

    var controls = {
        controlsList: null,
        blockHover: null
    };

    var selectedComponent = null;
    var selectedElement = null;
    var ghost = null;
    var helper = null;
    var draggableCurrentElement = null;
    var isDragging = false;
    var lastElementHoverWhileDragging = null;
    var tabIndex = -1;

    this.initialize = function () {
        initializeComponents();

        controls.blockHover = new BlockHover(elements.pageContainer, elements.pageContainerParent).initialize();

        elements.pageContainerParent.unbind().bind('addedColumn', function (e) {
            solveComponentsInContainer(e.Data.Row);
        });

        solveComponentsInContainer(elements.pageContainer);

        elements.pageContainer.on('mousedown', '.selectable', function () {
            var el = $(this);
            selectElement(el, true);

            return false;
        });

        selectFirstElement();
        setDraggableElements(elements.pageContainer.find('div:first'));

        return self;
    };

    var selectFirstElement = function () {
        elements.pageContainer.find('div:first').mousedown();
    };

    var initializeComponents = function () {
        controls.controlsList = new RS.Controls.List(null, elements.controlsContainer);

        var dataSource = new RS.Controls.DataSource({
            Data: $.grep(ComponentsRepository.All.sort(function (a, b) { return a.Name > b.Name; }), function (item, index) { return item.IsListed == true; })
        }).initialize();

        controls.controlsList.setDataSource(dataSource);
        setDraggableComponents();
    };

    var solveComponentsInContainer = function (container) {
        if (!container)
            return;

        var component = container.data('Component');
        if (component && component.Designer && component.Designer.DisableEditingInside)
            return;

        container.data('Component', ComponentsRepository.detect(container));

        if (!container.hasClass('selectable'))
            container.addClass('selectable');

        component = container.data('Component');
        if (component && component.Designer && component.Designer.DisableEditingInside)
            return;

        container.children().each(function () {
            solveComponentsInContainer($(this));
        });
    };

    var selectElement = function (el) {
        if (selectedElement)
            selectedElement.removeClass('selected');

        selectedElement = el;
        selectedElement.addClass('selected');

        setPropertiesDesigner(selectedElement);
    };

    var initializeDroppables = function () {
        var count = 0;

        elements.pageContainer.find('.selectable').each(function () {
            var el = $(this);
            if (!canCreateDroppable(el) || el.data('dragging') || el.hasClass('dragging')) {
                el.data('droppable', false);
                return true;
            }

            el.droppable({
                greedy: true,
                tolerance: 'pointer',
                hoverClass: "dropping-current-container",
                drop: function (event, ui) {
                    var el = $(this);
                    var addedElement = draggableCurrentElement || ($(selectedComponent.Html || selectedComponent.HelperHtml));
                    addedElement.attr('data-in-designer', 'true');

                    if (lastElementHoverWhileDragging)
                        addedElement.insertBefore(lastElementHoverWhileDragging);
                    else el.append(addedElement);

                    solveComponentsInContainer(addedElement.parent());
                    setDraggableElements(addedElement);
                    selectElement(addedElement);
                },
                over: function (event, ui) {
                    var el = $(this);

                    createGhost();
                    ghost.remove();

                    if (lastElementHoverWhileDragging)
                        ghost.insertBefore(lastElementHoverWhileDragging);
                    else ghost.appendTo(el);

                    $(this).find('.selectable').bind('mouseenter', function (e) {
                        if (lastElementHoverWhileDragging == $(e.target) || $(e.target).hasClass('ghost') || $(e.target).hasClass('dragging'))
                            return;

                        lastElementHoverWhileDragging = $(e.target);

                        if (ghost) {
                            ghost.remove();
                            if (lastElementHoverWhileDragging.is(":ui-droppable"))
                                lastElementHoverWhileDragging.append(ghost);
                            else ghost.insertBefore(lastElementHoverWhileDragging);
                        }
                    });
                },
                out: function () {
                    lastElementHoverWhileDragging = null;
                    ghost.remove();
                    $(this).find('.selectable').unbind('mouseenter');
                }
            });
            count++;

            el.data('droppable', true);
        });
    };

    var canCreateDroppable = function (el) {
        var allowedClasses = null;

        if (draggableCurrentElement) {
            var component = draggableCurrentElement.data('Component');
            if (component) {
                allowedClasses = component.AllowedClasses ? component.AllowedClasses.split(' ') : null;
                if (allowedClasses) {
                    for (var i = 0; i < allowedClasses.length; i++)
                        if (el.hasClass(allowedClasses[i]))
                            return true;
                }
                else return true;

                return false;
            }
            else {
                if (!el.parent().hasClass('row'))
                    return false;
            }

            return true;
        }

        if (!selectedComponent)
            return false;

        if (!selectedComponent.AllowedClasses)
            return true;

        allowedClasses = selectedComponent.AllowedClasses.split(' ');
        for (var i = 0; i < allowedClasses.length; i++) {
            if (el.hasClass(allowedClasses[i]))
                return true;
        }

        return false;
    };

    var createGhost = function () {
        if (ghost)
            return;

        ghost = $(selectedComponent.HelperHtml || selectedComponent.Html);
        ghost.attr('data-in-designer', 'true');
    };

    var setDraggableElements = function (container) {
        container.find('.selectable').each(function () {
            var el = $(this);

            el.draggable({
                helper: 'clone',
                cursorAt: { top: -10, left: -10 },
                start: function (event, ui) {
                    draggableCurrentElement = $(this);
                    draggableCurrentElement.addClass('dragging');
                    draggableCurrentElement.hide();
                    initializeDroppables();

                    controls.blockHover.disable();
                    isDragging = true;
                },
                stop: function (event, ui) {
                    $(this).removeClass('dragging');
                    draggableCurrentElement.show();
                    draggableCurrentElement = null;

                    if (ghost) {
                        ghost.remove();
                        ghost = null;
                    }

                    elements.pageContainer.find(":ui-droppable").droppable("destroy");

                    controls.blockHover.enable();
                    isDragging = false;
                },
                helper: function () {
                    helper = $($(this)[0].outerHTML);
                    helper.addClass('component-helper');
                    ghost = $($(this)[0].outerHTML);
                    ghost.removeClass('selected');
                    ghost.removeClass('hovered');
                    ghost.addClass('ghost');

                    return helper;
                }
            });
        });
    };

    var setDraggableComponents = function () {
        var index = 0;
        controls.controlsList.Elements.Me.find('[role="listitem"]').each(function () {
            var currentComponent = controls.controlsList.Options.DataSource.getLocalData()[index];
            $(this).draggable({
                start: function (event, ui) {
                    selectedComponent = currentComponent;
                    initializeDroppables();
                    isDragging = true;
                },
                stop: function (event, ui) {
                    selectedComponent = null;

                    if (ghost) {
                        ghost.remove();
                        ghost = null;
                    }

                    if (helper) {
                        helper.remove();
                        helper = null;
                    }

                    elements.pageContainer.find(":ui-droppable").droppable("destroy");
                    setDraggableElements(elements.pageContainer.find('div:first'));

                    isDragging = false;
                },
                helper: function () {
                    helper = $(currentComponent.HelperHtml || currentComponent.Html);
                    helper.addClass('component-helper');

                    return helper;
                }
            });

            index++;
        });
    };

    var setPropertiesDesigner = function (el) {
        elements.propertiesContainer.empty();

        var component = el.data('Component') || {};

        var html = templates.propertiesDesigner({
            Properties: component.Designer ? component.Designer.Properties : null
        });

        elements.propertiesContainer.html(html);

        if (!component || !component.Designer || !component.Designer.Properties)
            return;

        for (var i = 0; i < component.Designer.Properties.length; i++) {
            var p = component.Designer.Properties[i];
            var propertyContainer = elements.propertiesContainer.find('[role="property"][data-name="' + p.Name + '"]');

            switch (p.Type) {
                case DesignerPropertiesTypes.Select:
                    p.Control = propertyContainer.find('select:first');

                    if (p.set)
                        p.set(el, p.Control, component);

                    p.Control.unbind().change(function (e) {
                        p = getPropertyByElement($(e.target), component);
                        if (p.onChange)
                            p.onChange(el, $(this).val(), component);
                        p.SelectedValue = $(this).val();

                        return false;
                    });
                    break;
                case DesignerPropertiesTypes.Text:
                    p.Control = propertyContainer.find('input:first');

                    var value = null;
                    if (p.IsOption)
                        value = getComponentOption(el, p.Name) || p.DefaultValue;

                    if (p.set)
                        p.set(el, p.Control, component, value);
                    else p.Control.val(value);

                    p.Control.unbind().change(function (e) {
                        p = getPropertyByElement($(e.target), component);
                        var value = $(this).val() || p.DefaultValue;
                        if (p.onChange)
                            p.onChange(el, value, component);

                        if (p.IsOption)
                            setComponentOption(el, p.Name, value);

                        p.SelectedValue = $(this).val();

                        return false;
                    });
                    break;
            }
        }
    };

    var getPropertyByElement = function (el, component) {
        if (!el || !component)
            return;

        var parent = el.parents('[role="property"]:first');
        var index = parent.parent().children().index(parent);
        
        return component.Designer.Properties[index];
    };

    var setComponentOption = function (el, name, value) {
        if (!el || !name)
            return;

        var options = el.data('options') || {};
        options[name] = value;

        el.data('options', options);
    };

    var getComponentOption = function (el, name) {
        var options = el.data('options') || {};

        return options[name];
    }
};