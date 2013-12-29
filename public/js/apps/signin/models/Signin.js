define(function(require) {
    var Backbone = require('Backbone');

    var Signin = Backbone.Model.extend({
        urlRoot: '/api/contacts'
    });

    return Signin;
});