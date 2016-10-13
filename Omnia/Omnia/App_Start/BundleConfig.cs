using System.Web;
using System.Web.Optimization;

namespace Omnia
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/omnia").Include(
                        "~/Scripts/jquery-3.1.1.js",
                        "~/Scripts/jquery.validate.js",
                        "~/Scripts/jquery.validate.unobtrusive.js",
                        "~/Scripts/jstorage/jstorage.js",
                        "~/Scripts/handlebars.js",
                        "~/Scripts/parser.js",
                        "~/Scripts/moment.js",
                        "~/Scripts/bootstrap-datetimepicker.js",

                        "~/Scripts/RS.JS/RS.js",
                        "~/Scripts/RS.JS/RS.Core.js",
                        "~/Scripts/RS.JS/RS.PubSub.js",
                        "~/Scripts/RS.JS/RS.Constants.js",
                        "~/Scripts/RS.JS/RS.Keys.js",
                        "~/Scripts/RS.JS/Extensions/*.js",
                        "~/Scripts/RS.JS/RS.Guid.js",
                        "~/Scripts/RS.JS/RS.Cache.js",
                        "~/Scripts/RS.JS/RS.Event.js",
                        "~/Scripts/RS.JS/RS.LogTypes.js",
                        "~/Scripts/RS.JS/RS.Logger.js",
                        "~/Scripts/RS.JS/RS.Utils.js",
                        "~/Scripts/RS.JS/RS.Remote.js",
                        "~/Scripts/RS.JS/RS.Validation.js",
                        "~/Scripts/RS.JS/RS.Validators.js",
                        "~/Scripts/RS.JS/HandlebarsExtensions.js",
                        "~/Scripts/RS.JS/RS.HandlebarsRenderer.js",
                        "~/Scripts/RS.JS/RS.BoundElement.js",
                        "~/Scripts/RS.JS/RS.Controller.js",
                        "~/Scripts/RS.JS/RS.ControllersManager.js",

                        "~/Scripts/RS.JS/Controls/HandlebarsExtensions.js",
                        "~/Scripts/RS.JS/Controls/Controls.js",
                        "~/Scripts/RS.JS/Controls/Control.js",
                        "~/Scripts/RS.JS/Controls/DataSource.js",
                        "~/Scripts/RS.JS/Controls/Container.js",
                        "~/Scripts/RS.JS/Controls/NotificationTypes.js",
                        "~/Scripts/RS.JS/Controls/Notification.js",
                        "~/Scripts/RS.JS/Controls/Notifier.js",
                        "~/Scripts/RS.JS/Controls/ButtonTypes.js",
                        "~/Scripts/RS.JS/Controls/ButtonSizes.js",
                        "~/Scripts/RS.JS/Controls/Orientations.js",
                        "~/Scripts/RS.JS/Controls/Button.js",
                        "~/Scripts/RS.JS/Controls/ToggleButton.js",
                        "~/Scripts/RS.JS/Controls/ButtonGroup.js",
                        "~/Scripts/RS.JS/Controls/ModalSizes.js",
                        "~/Scripts/RS.JS/Controls/ModalButton.js",
                        "~/Scripts/RS.JS/Controls/Modal.js",
                        "~/Scripts/RS.JS/Controls/Tooltip.js",
                        "~/Scripts/RS.JS/Controls/Popover.js",
                        "~/Scripts/RS.JS/Controls/DataControl.js",
                        "~/Scripts/RS.JS/Controls/Dropdown.js",
                        "~/Scripts/RS.JS/Controls/ButtonDropdown.js",
                        "~/Scripts/RS.JS/Controls/SplitButton.js",
                        "~/Scripts/RS.JS/Controls/List.js",
                        "~/Scripts/RS.JS/Controls/TabItem.js",
                        "~/Scripts/RS.JS/Controls/Tab.js",
                        "~/Scripts/RS.JS/Controls/Breadcrumb.js",
                        "~/Scripts/RS.JS/Controls/Panel.js",
                        "~/Scripts/RS.JS/Controls/ProgressBar.js",
                        "~/Scripts/RS.JS/Controls/PagerSizes.js",
                        "~/Scripts/RS.JS/Controls/Pager.js",
                        "~/Scripts/RS.JS/Controls/Menu.js",
                        "~/Scripts/RS.JS/Controls/Autocomplete.js",
                        "~/Scripts/RS.JS/Controls/Combobox.js",
                        "~/Scripts/RS.JS/Controls/TreeViewNode.js",
                        "~/Scripts/RS.JS/Controls/TreeView.js",
                        "~/Scripts/RS.JS/Controls/Grid.js",
                        "~/Scripts/RS.JS/Controls/DateTimePicker.js",

                        "~/Scripts/RS.JS/Controls/DataGrid.js",
                        "~/Scripts/RS.JS/Controls/DataDropdown.js",

                        "~/Scripts/RS.JS/Controls/ControlsGenerator.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/PageDesigner").Include(
                        "~/Scripts/jquery-ui-1.12.1.js",
                        "~/Scripts/PageDesigner/DesignerPropertiesTypes.js",

                        "~/Scripts/PageDesigner/Components/Container.js",
                        "~/Scripts/PageDesigner/Components/GridRow.js",
                        "~/Scripts/PageDesigner/Components/GridColumn.js",
                        "~/Scripts/PageDesigner/Components/Heading.js",
                        "~/Scripts/PageDesigner/Components/Paragraph.js",
                        "~/Scripts/PageDesigner/Components/DataDropdown.js",
                        "~/Scripts/PageDesigner/Components/WidthTypes.js",

                        "~/Scripts/PageDesigner/Controls/BlockHover.js",

                        "~/Scripts/PageDesigner/ComponentsRepository.js",
                        "~/Scripts/PageDesigner/PageDesigner.js",
                        "~/Scripts/PageDesigner/PageDesignerModule.js"
                        ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/controls.css",
                      "~/Content/alerter.css",
                      "~/Content/container.css",
                      "~/Content/modal.css",
                      "~/Content/button.css",
                      "~/Content/notification.css",
                      "~/Content/tooltip.css",
                      "~/Content/popover.css",
                      "~/Content/togglebutton.css",
                      "~/Content/dropdown.css",
                      "~/Content/buttondropdown.css",
                      "~/Content/splitbutton.css",
                      "~/Content/list.css",
                      "~/Content/tab.css",
                      "~/Content/breadcrumb.css",
                      "~/Content/panel.css",
                      "~/Content/progressbar.css",
                      "~/Content/pager.css",
                      "~/Content/menu.css",
                      "~/Content/autocomplete.css",
                      "~/Content/combobox.css",
                      "~/Content/treeview.css",
                      "~/Content/grid.css",
                      "~/Content/bootstrap-datetimepicker.css"));

            bundles.Add(new StyleBundle("~/Content/PageDesigner").Include(
                      "~/Content/PagesDesigner.css"));
        }
    }
}