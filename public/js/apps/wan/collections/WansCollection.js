define(function(require) {
    var Backbone = require('Backbone');
    var Wan = require('./../models/Wan');

    var WansCollection = Backbone.Collection.extend({
        model: Wan,

        url: 'api/user/config/wans',

        title: 'courtesy of backbonejs'
    });

    return WansCollection;
});