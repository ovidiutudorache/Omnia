var PageDesignerModule = function () {
    var self = this;

    var elements = {
        designerContainer: $(".page-designer"),
        savePage: $("#save-page"),
        deletePage: $("#delete-page"),
        pageName: $(".page-name"),
        setMasterPage: $('.set-masterpage'),
        parametersTab: $("#parameters-tab"),
        dataViewTab: $("#dataview-tab")
    };

    var pageDesigner = null;
    var pageData = null;
    var page = null;
    var pageDataView = null;

    this.initialize = function () {
        pageDesigner = new PageDesigner(elements.designerContainer, page).initialize();
        //pageData = new PageData(elements.parametersTab, page).initialize();

        //pageDataView = new PageDataView(elements.dataViewTab, page).initialize();

        return self;
    };
};
new PageDesignerModule().initialize();