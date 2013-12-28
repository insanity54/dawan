define(function(require) {
    var Backbone = require('Backbone');

    // set x-editable to inline mode.
    // (x-editable is a js lib enabling bootstrap styled editable tables)
    $.fn.editable.defaults.mode = 'inline';

    var ButtonsView = Backbone.View.extend({
        template: require('./../../templates/AddWanView'),

        render: function() {
            this.$el.html(this.template());
            return this;
	}
    });

    return AddWanView;
});