const helper = require('node-red-node-test-helper');
const setStateNode = require('../nodes/set-state/set-state.js');

helper.init(require.resolve('node-red'));

describe('set-state Node', function () {
    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload();
        helper.stopServer(done);
    });

    it('should be loaded', function (done) {
        const flow = [{ id: 'n1', type: 'set-state', name: 'test name' }];
        helper.load(setStateNode, flow, function () {
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