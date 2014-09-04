


function Controller(model, view) {

    this.model = model;
    this.view = view;

    this.view.onChange = function(change) {
        this.handleChange(change)
    }.bind(this);

}


Controller.prototype.handleChange = function(change) {
    
}
            