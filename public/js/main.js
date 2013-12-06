// require the js modules we need
define([
    'require',
    'jquery',
    'bootstrap',
    'underscore',
    'nunjucks',
    'backbone'
], function(require) {

    // put nunjucks in our namespace
    var nunjucks = require('nunjucks');

    // Define a wans model
    var Wans = Backbone.Model.extend({
	// Default wans attribute value
	defaults: {
            title: 'WAN PORT',
            completed: false
	}
    });

    // instantiate the wans model with a title, with the enabled attribute
    // defaulting to false

    var myWans = new Wans({
	title: 'Check attributes property of the logged models in the console'
    });

    var WansView = Backbone.View.extend({

	tagName: 'li',

	// Cache the template function for a single item
	wansTpl: nunjucks.render( 'wans.html', myWans.attributes ),

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
            this.$el.html( this.wansTpl );

//            this.$el.html( this.wansTpl( this.model.toJSON() ) );
            this.input = this.$('.edit');

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
    var wansView = new WansView({model: myWans});
    
});