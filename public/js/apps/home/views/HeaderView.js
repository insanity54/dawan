define(function(require) {
    var Backbone = require('Backbone');

    var HeaderView = Backbone.View.extend({
        template: reqire('./../templates/HeaderView'),

        render: function() {
            this.$el.html(this.template({title: 'default title'}));
            return this;
        }
    });

    return HeaderView;
});
