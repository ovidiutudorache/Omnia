RS.Controls.Button = function (options, container, isInherited) {
    var self = this;

    this.Options = {
        Type: RS.Controls.ButtonTypes.Default,
        Templates: [
            {
                IsDefault: true,
                Id: 'button-default-template'
            }
        ],
        Size: RS.Controls.ButtonSizes.Default,
        IsBlock: false,
        Icon: null,
        Image: null,
        Text: null
    };

    if (options)
        self.Options = $.extend(self.Options, options);

    RS.Controls.Button.superclass.constructor.call(this, self.Options, container, true);

    this.initialize = override(self.initialize, function () {
        self.PubSub.addEvent('click');

        return self;
    });

    this.initializeHtml = override(self.initializeHtml, function () {
        self.applyOptions();

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.click(function (e) {
            self.PubSub.triggerEvent('click', {
                Event: e,
                Source: self
            });
        });

        return self;
    });

    this.applyOptions = function (options) {
        options = options || self.Options;

        self.setType(self.Options.Type);
        self.setSize(self.Options.Size);
        self.setBlock(self.Options.IsBlock);
        if (self.Options.Icon)
            self.setIcon(self.Options.Icon);
        if (self.Options.Image)
            self.setImage(self.Options.Image);
        if (self.Options.Text)
            self.setText(self.Options.Text);
    };

    this.initializeFromContainer = override(self.initializeFromContainer, function () {
        if (!container || self.Options.KeepOptionsFromStart)
            return self;

        self.Options.Type = getTypeFromElement();
        self.Options.Size = getSizeFromElement();
        self.Options.Text = getTextFomElement();
        self.Options.IsBlock = container.hasClass('btn-block');
        self.Options.Icon = (container.find('[role="img"]:first .glyphicon:first').attr('class') || '').replace('glyphicon-', '').replace('glyphicon', '').trim();
        self.Options.Image = container.find('[role="img"]:first img:first').attr('src');

        return self;
    });

    this.setType = function (type) {
        type = type || RS.Controls.ButtonTypes.Default;
        self.Options.Type = type;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.removeClass('btn-default btn-primary btn-success btn-info btn-warning btn-danger btn-link').addClass('btn-' + type);

        return self;
    };

    this.setSize = function (size) {
        size = size || RS.Controls.ButtonSizes.Default;
        self.Options.Size = size;

        if (!self.Elements.Me)
            return self;

        self.Elements.Me.removeClass('btn-xs btn-sm btn-lg').addClass(size);

        return self;
    };

    this.setBlock = function (isBlock) {
        self.Options.IsBlock = isBlock;

        if (!self.Elements.Me)
            return self;

        if (isBlock && !self.Elements.Me.hasClass('btn-block'))
            self.Elements.Me.addClass('btn-block');
        else self.Elements.Me.removeClass('btn-block');

        return self;
    }

    this.getChildrenContainer = function () {
        if (!self.Elements.Me)
            return null;

        return self.Elements.Me.find('[role="main"]:first');
    };

    this.setText = function (text) {
        self.Options.Text = text;

        self.setContent(text);

        return self;
    };

    this.setIcon = function (name) {
        self.Options.Icon = name;

        if (!self.Elements.Me)
            return self;

        if (!name)
            self.Elements.Me.find('[role="img"]').empty();
        else self.Elements.Me.find('[role="img"]').html('<span class="glyphicon glyphicon-' + name + '" aria-hidden="true"></span>');

        return self;
    };

    this.setImage = function (url) {
        self.Options.Image = url;

        if (!self.Elements.Me)
            return self;

        if (!url)
            self.Elements.Me.find('[role="img"]').empty();
        else self.Elements.Me.find('[role="img"]').html('<img src="' + url + '" />');

        return self;
    };

    var getTypeFromElement = function () {
        if (!self.Elements.Me)
            return RS.Controls.ButtonTypes.Default;

        if (self.Elements.Me.hasClass('btn-primary')) return RS.Controls.ButtonTypes.Primary;
        if (self.Elements.Me.hasClass('btn-success')) return RS.Controls.ButtonTypes.Success;
        if (self.Elements.Me.hasClass('btn-info')) return RS.Controls.ButtonTypes.Info;
        if (self.Elements.Me.hasClass('btn-warning')) return RS.Controls.ButtonTypes.Warning;
        if (self.Elements.Me.hasClass('btn-danger')) return RS.Controls.ButtonTypes.Danger;
        if (self.Elements.Me.hasClass('btn-link')) return RS.Controls.ButtonTypes.Link;

        return RS.Controls.ButtonTypes.Default;
    };

    var getSizeFromElement = function () {
        if (!self.Elements.Me)
            return RS.Controls.ButtonSizes.Default;

        if (self.Elements.Me.hasClass('btn-xs')) return RS.Controls.ButtonSizes.ExtraSmall;
        if (self.Elements.Me.hasClass('btn-sm')) return RS.Controls.ButtonSizes.Small;
        if (self.Elements.Me.hasClass('btn-lg')) return RS.Controls.ButtonSizes.Large;

        return RS.Controls.ButtonSizes.Default;
    };

    var getTextFomElement = function () {
        if (!self.Elements.Me)
            return null;

        return self.Elements.Me.find('[role="main"]').text();
    };

    this.getIdentifier = function () { return 'Button'; }

    if (!isInherited)
        self.initialize();
};
extend(RS.Controls.Button, RS.Controls.Control);