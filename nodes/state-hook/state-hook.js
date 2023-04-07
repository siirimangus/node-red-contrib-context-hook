const strip = require('strip-comments');

const { getEmitter } = require('../../events/emitter.js');

module.exports = function(RED) {
    function StateHook(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const global = node.context().global;

        const code = strip(config.func);
        const watchedValues = [];

        let timer;

        const runCode = () => {
            clearTimeout(timer);

            timer = setTimeout(() => {
                try {
                    let fn;

                    eval(`fn = (async function () {${code}});`);

                    fn()
                        .then(msg => {
                            if (msg) {
                                node.send(msg);
                            }
                            node.status({});
                        })
                        .catch(error => {
                            console.error(error);
                            node.status({ fill: 'red', shape: 'ring', text: 'error' });
                        });
                } catch (error) {
                    console.error(error);
                    node.status({ fill: 'red', shape: 'ring', text: 'error' });
                }
            }, 1); // run code max once per 1ms
        }

        const useGlobal = (property, defaultValue = null) => {
            if (!watchedValues.includes(property)) {
                watchedValues.push(property);

                getEmitter().on(property, () => {
                    runCode();
                });
            }

            let stateValue = global.get(property);

            if (undefined === stateValue || null === stateValue) {
                stateValue = defaultValue;
            }

            return stateValue;
        };

        node.on('close', () => {
            watchedValues.forEach(watched => getEmitter().removeAllListeners(watched));
            watchedValues.splice(0, watchedValues.length);
        });

        setTimeout(runCode, 2000 + Math.random() * 2000);
    }

    RED.nodes.registerType('state-hook', StateHook);
};