define(function(require) {
    var Backbone = require('Backbone');
    var viewManager = require('./viewManager');

    var Router = Backbone.Router.extend({
        routes: {
            '' : function() {
                require('./../apps/wans/app').run(viewManager);
	    }

	}
    });

    return Router;
});

            