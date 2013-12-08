requirejs.config({
    shim: {
        'jquery': {
            exports: '$'
	},
        'underscore': {
            deps: ['jquery'],
            exports: '_'
	},
        'bootstrap': ['jquery'],
        'nunjucks': {
            exports: 'nunjucks'
	},
        'backbone': {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        'bootstrap-editable': ['jquery']
    }
});


// require the js modules we need
define([
    'require',
    'jquery',
    'underscore',
    'bootstrap',
    'nunjucks',
    'backbone',
    'bootstrap-editable'
], function(require) {

    // @todo separate logic into separate file. this file will become mainly about config.
    // see here for example on how to split the two https://github.com/requirejs/example-jquery-shim/

    console.log('hai guize i have the hsotname: ');

    // @todo separate this into different file
    // set x-editable to inline mode
    $.fn.editable.defaults.mode ='inline';


    // put nunjucks in our namespace
    var nunjucks = require('nunjucks');

    var Backbone = require('backbone');

    // Define a wans model
    var Wans = Backbone.Model.extend({
	// Default wans attribute value
	defaults: {
            title: 'WAN PORT',
            completed: false,
            jenk: "junk",
            ports: [7270, 7271, 7272, 7273, 7274, 7275, 7276, 7277, 7278, 7279],
	}
    });

    // instantiate the wans model with a title, with the enabled attribute
    // defaulting to false
    var myWans = new Wans({
	title: 'WAN Port wun'
    });

    var myWans2 = new Wans({
        title: 'TWO TWO TWO'
    });


    var WansView = Backbone.View.extend({

	tagName: 'li',

	// Cache the template function for a single item
	wansTpl: function(attributes) {
            console.log( 'wantpl-> ' + attributes.title );
            return nunjucks.render( 'wans.html', attributes );
	},

	events: {
            'dblclick label': 'edit',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close'
	},

	// Called when the view is first created
	initialize: function() {
            this.$el = $('#wans');
            this.render();
	},

	// Re-render the titles of the wans item.
	render: function() {
            
//            var template = nunjucks.renderString( this.$el.html() );
            console.dir(this.model);
            this.$el.html( this.wansTpl( this.model.attributes ) );

//            this.$el.html( this.wansTpl( this.model.toJSON() ) );
            this.input = this.$('.edit');

            // apply editable method to elements (x-editable library)
            $('#subdomain').editable();
            $('#ports').editable({
                type: 'select',
                title: 'derp',
                value: 2
//                source: ports
	    });

            return this;
	},

	edit: function() {
            // executed when wan label is double clicked
	},

	close: function() {
            // executed when wan loses focus
	},

	updateOnEnter: function( e ) {
            // executed on each keypress when in wans edit mode
	}
    });

    // create a view for wans
//    var wansView = new WansView({model: myWans});
    var wansView = new WansView({model: myWans2});
    
});




