function View(window) {
    this.textbox = window.document.querySelector('#uid');
    this.textbox.addEventListener('onchange', this.handleChange.bind(this));
}



View.prototype.handleChange = function(event) {
    event.preventDefault();
    this.onChange.call(this, event);
}