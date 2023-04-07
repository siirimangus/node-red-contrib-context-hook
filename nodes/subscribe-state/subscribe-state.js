const { getEmitter } = require('../../events/emitter');

module.exports = function(RED) {
    function SubscribeState(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const { property } = config;

        getEmitter().on(property, ({ previousValue, value }) => {
            node.send({
                property,
                previousValue,
                value,
                payload: value,
            });
        });

        node.on('close', () => {
            getEmitter().removeAllListeners(property);
        });
    }

    RED.nodes.registerType('subscribe-state', SubscribeState);
}