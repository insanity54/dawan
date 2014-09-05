function View(window) {
    this.textbox = window.document.querySelector('#uid');
    this.textbox.addEventListener('input', this.handleChange_.bind(this));
}


View.prototype.handleChange_ = function handleChange_(event) {
    this.onChange.call(this, event);
}


View.prototype.setValues = function setValues(values) {
    console.dir(values);
    console.dir(this.textbox);
    this.textbox.value = values.uid;
}