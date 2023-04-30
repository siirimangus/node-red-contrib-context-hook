const helper = require('node-red-node-test-helper');
const setGlobalStateNode = require('../nodes/set-global-state/set-global-state.js');

helper.init(require.resolve('node-red'));

describe('set-global-state Node', function () {
    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload();
        helper.stopServer(done);
    });

    it('should be loaded', function (done) {
        const flow = [{ id: 'n1', type: 'set-global-state', name: 'test name' }];
        helper.load(setGlobalStateNode, flow, function () {
            const node = helper.getNode('n1');
            try {
                expect(node).toHaveProperty('name', 'test name');
                done();
            } catch(err) {
                done(err);
            }
        });
    });
});