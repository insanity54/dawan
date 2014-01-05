// handles javascript module loading

requirejs.config({
    shim: {
        'jQuery': {
            exports: '$'
	},
        'Underscore': {
            deps: ['jQuery'],
            exports: '_'
	},
        'bootstrap': ['jQuery'],

        'nunjucks': {
            exports: 'nunjucks'
	},
        'Backbone': {
            deps: ['Underscore'],
            exports: 'Backbone'
        },
        'xeditable': ['jQuery', 'bootstrap'],

        'ApplicationRouter': {
            deps: ['jQuery', 'Underscore,', 'Backbone']
        }
    },

    paths: {
        jQuery: './../components/jquery/jquery',
        Underscore: './../components/underscore/underscore',
        Backbone: './../components/backbone/backbone',
        bootstrap: './../components/bootstrap/dist/js/bootstrap',
        nunjucks: './../components/nunjucks/browser/nunjucks',
        xeditable: './../components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable'
    }
});


require(['core/router', 'core/client', 'Backbone'], function(Router, client, Backbone) {
    var app = {
        root: '/'
    };

    window.Router = new Router();
    client.setup(window, app);

    Backbone.history.start({ pushState: true });

});


/*
// require the js modules we need
define([
    'require',
    'jQuery',
    'Underscore',
    'bootstrap',
    'nunjucks',
    'Backbone',
    'xeditable'
], function(require) {

    // @todo separate logic into separate file. this file will become mainly about config.
    // see here for example on how to split the two https://github.com/requirejs/example-jquery-shim/

    console.log('hai guize i have the hsotname: ');

    // @todo separate this into different file
    // set x-editable to inline mode
    $.fn.editable.defaults.mode ='inline';


    // put nunjucks in our namespace
    var nunjucks = require('nunjucks');

    var Backbone = require('Backbone');




    

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

    
    var wan_add_button = Backbone.View.extend({

        tagName: 'li',

        // cache the template
        wan_add_tpl: function(attributes) {
            return nunjucks.render( 'wan_add.html', attributes );
        },

        // listen for these events
        events: {
            'click #wan_add': 'wan_add'
	},

        // called when the view is first created
        initialize: function() {
            this.$el = $('#wan_add');
            this.render();
	},

	render: function() {
            
            console.dir(this.model);
            this.$el.html( this.wan_add_tpl( this.model.attributes ) );

            return this;
	}

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
            'blur .edit': 'close',
            'click .btn': 'updateOnEnter',
            'click #addwan': 'addWan'
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
//            nunjucks.render( 'wans.html', attributes );

            this.$el.html(nunjucks.render( 'wans.html', this.model.attributes ));
//            this.$el.html( this.wansTpl( this.model.attributes ));

//            this.$el.html( this.wansTpl( this.model.toJSON() ) );
//            this.input = this.$('.edit');

            // apply editable method to elements (x-editable library)
            $('#subdomain').editable();
            $('#ports').editable({
                type: 'select',
                title: 'derp',
                value: 2
//                source: ports
	    });

            $('<p><button id="addwan" class="btn btn-primary" type="button"><span class="glyphicon glyphicon-plus"></span> Add a WAN porT</button></p>').insertAfter('#wans');

            return this;
	},

	edit: function() {
            // executed when wan label is double clicked
            console.log('dbl click');
	},

	close: function() {
            // executed when wan loses focus
            console.log('close event fired');
	},

	updateOnEnter: function( e ) {
            // executed on each keypress when in wans edit mode
            console.log('updateOnEnter has fired. e:' + e);
	},

	addWan: function() {
            // called when the button is clicked
            console.log('addWan event');
	}


    });


    // create a view for wans
//    var wansView = new WansView({model: myWans});
    var wansView = new WansView({model: myWans2});

    // create a view for the wan add button
//    var wanAdd = new WansView({model: myWanAdd});
    
});
*/