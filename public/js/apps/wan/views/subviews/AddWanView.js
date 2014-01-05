define(function(require) {
    var Backbone = require('Backbone');
    var xeditable = require('xeditable');
    var nunjucks = require('nunjucks');

    // set x-editable to inline mode.
    // (x-editable is a js lib enabling bootstrap styled editable fields)
    $.fn.editable.defaults.mode = 'inline';

    var AddWanView = Backbone.View.extend({
//        template: require('hbs!./../../templates/AddWanView'), // @todo the backbone-express-spa framework uses require-handlebars-plugin but since no such thing exists for what we're using, nunjucks, can we safely ignore this? Is doing so going to be a performance issue?

        render: function() {
            this.$el.html(nunjucks.render( 'WanView.html', this.model.attributes));
            return this;
	}
    });

    return AddWanView;
});