define(function(require) {
    var Backbone = require('Backbone');

    var Wan = Backbone.Model.extend({
        // the url used to retrieve the model's data from the server
        urlRoot: '/api/user/config/wans',

        // Default wans attribute value
        defaults: {
            title: 'WAN PORT',
            completed: false,
            jenk: "juunk",
            ports: [7270, 7271, 7272, 7273, 7274, 7275, 7276, 7277, 7278, 7279]
        }
    });

    return Wan
});