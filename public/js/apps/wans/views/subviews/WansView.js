define(function(require) {
    var Backbone = require('Backbone');

    var WansView = Backbone.View.Extend({
        tagName: 'li',

        // Cache the template function for a single item
        template: function(attributes) {
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
