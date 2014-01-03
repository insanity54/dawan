define(function(require) {
    var Backbone = require('Backbone');
    var xeditable = require('xeditable');

    // set x-editable to inline mode.
    // (x-editable is a js lib enabling bootstrap styled editable fields)
    $.fn.editable.defaults.mode = 'inline';

    var AddWanView = Backbone.View.extend({
//        template: require('hbs!./../../templates/AddWanView'), // @todo the backbone-express-spa framework uses require-handlebars-plugin but since no such thing exists for what we're using, nunjucks, can we safely ignore this? Is doing so going to be a performance issue?y

        render: function() {
            this.$el.html(this.template());
            return this;
	}
    });

    return AddWanView;
});