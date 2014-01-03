define([
  'require',
  'jquery',
  'underscore',
  'bootstrap',
  'nunjucks',
  'backbone',
  'xeditable'
], function(require) {

    var view = {};

    /*
     * ATTRIBUTES
     */

    view.className = 'wan'



    /*
     * EVENTS
     */

    view.events = {
        'click .add' : 'onAddWan',
        'keypress .edit' : 'onEdit'
    }



    /*
     * EVENT HANDLERS
     */

    view.onAddWan = function() {
        console.log('add wan event');
    }

    view.onEdit = function() {
        console.log('edit event');
    }

    

    /*
     * PUBLIC CLASS METHODS
     */
    view.render = function() {
        console.log('wans view rendering');
        this.$el.html( nunjucks.render( 'wans.html', attributes ));
        return this;
    }


    /*
     * VIEW CONSTRUCTOR AND INITIALIZATION
     */
    view.initialize = function(options) {
        var that = this;
        _.bindAll(this);
	
        this.model = options.model;
        console.log('model', this.model.id)
        if(!this.model.isNew()) {
            // model does not have an id yet
            console.log('bound ', this.model.id)
            