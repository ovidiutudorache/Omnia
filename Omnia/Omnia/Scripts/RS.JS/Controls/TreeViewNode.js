RS.Controls.TreeViewNode = function (id, name, children, isExpanded) {
    this.Id = id;
    this.Name = name;
    this.Nodes = children;
    this.IsExpanded = isExpanded || false;
    this.IsSelected = false;
};