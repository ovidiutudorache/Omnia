RS.BoundElement = function (element) {
    var self = this;

    this.Element = element;
    this.InitialExpression = null;
    this.Matches = null;
    this.Binding = RS.Utils.getBindingFromAttributes(element);

    var bound = false;

    this.DataBindExpression = this.Binding ? this.Binding.Expression : null;
    this.BindingOptions = null;
    if (this.DataBindExpression) {
        this.InitialExpression = this.DataBindExpression;
        this.DataBindExpression = this.DataBindExpression.replaceAll('{{', '').replaceAll('}}', '');
        this.Matches = [this.DataBindExpression];
    }
    else {
        this.InitialExpression = element.text();
        this.Matches = this.InitialExpression ? RS.Utils.getBoundNames(this.InitialExpression) : null;
    }

    this.VisibilityExpression = element.attr('data-bind-visible');

    this.solve = function (controller, e) {
        if (!controller)
            return;

        if (e && e.Source == self)
            return;

        if (e && e.IsSource && self.DataBindExpression && controller.Model && bound) {
            var value = self.getValue();

            var currentValue = controller.Model[self.DataBindExpression];

            if (currentValue == value)
                return;

            controller.Model[self.DataBindExpression] = value;
            controller.Model.PubSub.triggerEvent('change', {
                Source: self,
                Property: self.DataBindExpression,
                Value: value
            });
        }

        if ((!e || (e && !e.IsSource))) {
            if (self.Matches && self.Matches.length) {
                var result = solveFullExpression(controller, self.InitialExpression, self.Matches);
                self.setValue(value, result);
            }

            if (self.VisibilityExpression) {
                var visibilityMatches = RS.Utils.getBoundNames(self.VisibilityExpression);
                var isVisible = solveFullExpression(controller, self.VisibilityExpression, visibilityMatches);
                isVisible = isVisible === true || (typeof isVisible == "string" && isVisible.toLowerCase() == 'true');
                if (isVisible)
                    element.show();
                else element.hide();
            }
        }

        bound = true;
    };

    this.setValue = function (value, result) {
        if (self.Element[0].tagName.toLowerCase() == 'input') {
            if (self.Element.is(":checkbox")) {
                if (result)
                    result = typeof result == 'string' ? result.toLowerCase() == 'true' : result;

                if (result)
                    self.Element.check();
                else self.Element.uncheck();
            }
            else if (self.Element.is(":radio")) {
                var currentValue = self.getValue();
                if (result == currentValue)
                    self.Element.check();
                else self.Element.uncheck();
            }
            else self.Element.val(result);
        }
        else if (self.Element[0].tagName.toLowerCase() == 'select') {
            self.Element.val(result);
        }
        else {
            var control = self.Element.getControl();
            if (control) {
                if (typeof control == 'object') {
                    control.setValue(result, self.Binding && self.Binding.Options ? self.Binding.Options.Source : null);
                }
            }
            else {
                self.Element.html(result);
            }
        }
    };

    this.getValue = function () {
        var value = null;

        var control = self.Element.getControl();
        if (control)
            value = typeof control == 'object' ? RS.Utils.getValue(control, self.Binding.Options.Source) : null;
        else if (self.Element.is(":checkbox"))
            value = self.Element.is(":checked");
        else value = self.Element.val();

        return value;
    };

    this.getEventsTriggeringChange = function () {
        if (self.Element.is(":checkbox") || self.Element.is(":radio"))
            return 'change';

        if (self.Element[0].tagName.toLowerCase() == 'input')
            return 'keyup keydown';

        return 'change';
    };

    var solveExpression = function (expression, model) {
        if (!model) {
            var unsolvedVariables = Parser.parse(expression).variables();
            if (unsolvedVariables) {
                model = {};
                for (var j = 0; j < unsolvedVariables.length; j++)
                    model[unsolvedVariables[j]] = '';
            }
        }

        var processedExpression = preprocessExpression(expression);
        var parsedExpression = Parser.parse(processedExpression, model).simplify(model);
        var value = parsedExpression.evaluate();

        return value;
    };

    var preprocessExpression = function (expression) {
        if (!expression)
            return null;

        return expression;
    };

    var solveFullExpression = function (controller, expression, matches) {
        if (!expression || !matches || !matches.length)
            return expression;

        var result = expression;
        for (var i = 0; i < matches.length; i++) {
            var expression = matches[i];
            var value = solveExpression(expression, controller.Model);
            result = result.replace('{{' + expression + '}}', value);
        }

        return result;
    }
};