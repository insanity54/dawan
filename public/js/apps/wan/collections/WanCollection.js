define(function(require) {
    var Backbone = require('Backbone');
    var Wan = require('./../models/Wan');

    var WanCollection = Backbone.Collection.extend({
        model: Wan,

        url: 'api/wans',

        title: 'courtesy of backbonejs'
    });

    return WanCollection;
});