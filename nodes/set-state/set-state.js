const { isEqual } = require('lodash');

module.exports = function(RED) {
    function SetState(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        let { property } = config;
        const global = node.context().global;

        node.on('input', function(msg) {
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
            } catch (e) {
                console.error(e);
                node.status({ fill: 'red', shape: 'ring', text: 'error' });
            }
        });
    }

    RED.nodes.registerType('set-state', SetState);
}