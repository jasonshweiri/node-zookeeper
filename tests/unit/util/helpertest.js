const sinon = require('sinon');
const test = require('ava');
const zkConstants = require('../../../lib/constants');
const { deprecationLog, findZkConstantByCode } = require('../../../lib/helper');

class Test {
    static method() {
        deprecationLog(Test.name, 'method');
    }
}

test('deprecation log is called with proper arguments', (t) => {
    const deprecationLogStub = sinon.stub();
    t.plan(3);

    deprecationLogStub(Test.name, 'method');

    t.is(deprecationLogStub.callCount, 1);
    t.is(deprecationLogStub.getCall(0).args[0], 'Test');
    t.is(deprecationLogStub.getCall(0).args[1], 'method');
});

test('deprecation log gives proper message', (t) => {
    const consoleStub = sinon.stub(console, 'warn');
    t.plan(2);

    Test.method();

    t.is(consoleStub.callCount, 1);
    t.is(consoleStub.getCall(0).args[0], 'ZOOKEEPER LOG: Test::method is being deprecated!');

    consoleStub.restore();
});

test('finds the BAD ARGUMENTS constant', (t) => {
    t.plan(2);
    const expected = -8;

    const res = findZkConstantByCode(expected, zkConstants);

    t.is(res[0], 'ZBADARGUMENTS');
    t.is(res[1], expected);
});

test('finds constants with fallback', (t) => {
    t.plan(2);
    const expected = 4711;

    const res = findZkConstantByCode(expected, zkConstants);

    t.is(res[0], 'unknown');
    t.is(res[1], expected);
});
