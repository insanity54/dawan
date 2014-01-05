// kicks off the wans backbone app (MVC)

define(function(require) {
    var WansCollection = require('./collections/WansCollection');
    var MainView = require('./views/MainView');

    return {
        run: function(viewManager) {
            var wansCollection = new WansCollection();
            wansCollection.fetch({
                success: function(wansCollection) {
                    var view = new MainView({collection: wansCollection});
                    viewManager.show(view);
                }
            });
        }
    };
});