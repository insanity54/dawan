// kicks off the wans backbone app (MVC)

define(function(require) {
    var WanCollection = require('./collections/WanCollection');
    var MainView = require('./views/MainView');

    return {
        run: function(viewManager) {
            var wanCollection = new WanCollection();
            wanCollection.fetch({
                success: function(wanCollection) {
                    var view = new MainView({collection: wanCollection});
                    viewManager.show(view);
                }
            });
        }
    };
});