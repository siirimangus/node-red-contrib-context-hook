const EventEmitter = require('events');

EventEmitter.EventEmitter.defaultMaxListeners = 30;

const emitter = new EventEmitter();

module.exports = {
    getEmitter: () => emitter,
};