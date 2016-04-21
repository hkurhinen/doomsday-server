'use strict';
var Document = require('camo').Document;

class Entry extends Document {
    constructor() {
        super();
        this.name = String;
        this.time = Number;
    }
}

module.exports = Entry;