const { isEqual } = require('lodash');
const { getEmitter } = require('../../events/emitter');

module.exports = function(RED) {
    function SetGlobalState(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        let { property } = config;
        const global = node.context().global;

        node.on('input', function(msg, send, done) {
            if (msg.property) {
                property = msg.property;
            }

            try {
                const previousValue = global.get(property);

                let value;
                eval(`value = function() {${config.func}}();`);

                node.status({});

                if (value === undefined) {
                    return;
                }

                if (isEqual(previousValue, value)) {
                    return;
                }

                global.set(property, value);

                getEmitter().emit(property, {
                    previousValue,
                    value,
                });

                // This call is wrapped in a check that 'done' exists
                // so the node will work in earlier versions of Node-RED (<1.0)
                if (done) {
                    done();
                }
            } catch (error) {
                if (done) {
                    // Node-RED 1.0 compatible
                    done(error);
                } else {
                    // Node-RED 0.x compatible
                    node.error(error, msg);
                }
                console.error(error);
                node.status({ fill: 'red', shape: 'ring', text: 'error' });
            }
        });
    }

    RED.nodes.registerType('set-global-state', SetGlobalState);
}