define(function(require) {
    var Backbone = require('Backbone');

    var WanView = require('./subviews/WanView');
    var AddWanView = require('./subviews/AddWanView');

    var MainView = Backbone.View.extend({
        initialize: function() {
            this.subviews = [];
	},

        render: function() {
            var wanView = new WanView({collection: this.collection});
            this.$el.append(wanView.render().el);
            this.subviews.push(wanView);

            // var addWanView = new AddWanView();
            // this.$el.append(addWanView.render().el);
            // this.subviews.push(addWanView);

            return this;
	}
    });

    return MainView;
});