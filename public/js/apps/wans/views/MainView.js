define(function(require) {
    var Backbone = require('Backbone');

    var AddWanView = require('./subviews/AddWanView');

    var MainView = Backbone.View.extend({
        initialize: function() {
            this.subviews = [];
	},

        render: function() {
            var addWanView = new AddWanView();
            this.$el.append(addWanView.render().el);
            this.subviews.push(addWanView);

            var wansView = new AddWanView();
            this.$el.append(wansView.render().el);
            this.subviews.push(inboxView);

            return this;
	}
    });

    return MainView;
});