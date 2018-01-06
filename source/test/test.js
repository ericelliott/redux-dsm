// theirs
const test = require('tape');
const lodash = require('lodash');
const pipe = lodash.flow;
// ours
const dsm = require('../dsm');

const createFlatStates = () => [
  ['initialize', 'idle'],
  ['fetch', 'fetching'],
  ['cancel', 'idle'],
  ['report error', 'error'],
  ['handle error', 'idle'],
  ['report success', 'success'],
  ['handle success', 'idle']
];

const mockStates = [
  ['initialize', 'idle',
    ['fetch', 'fetching',
      ['cancel', 'idle'],
      ['report error', 'error',
        ['handle error', 'idle']
      ],
      ['report success', 'success',
        ['handle success', 'idle']
      ]
    ]
  ]
];

const mockOptions = ({
  component = 'myComponent',
  description = 'fetch foo',
  actionStates = mockStates
} = {}) => ({
  component, description, actionStates
});

test('modules & package specs', nest => {
  nest.test('dsm function exposed', assert => {
    const msg = 'should export commonjs module';
    const expected = 'function';
    const actual = typeof require('../dsm');
    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('dsm object exposed', assert => {
    const msg = 'should export dsm property allowing `import { dsm }`';
    const expected = 'function';
    const actual = typeof require('../dsm').dsm;
    assert.same(actual, expected, msg);
    assert.end();
  });
});

test('dsm() action types', nest => {
  nest.test('flat state', assert => {
    const msg = 'should return action types corresponding with given transitions';

    const expected = {
      initialize: 'myComponent::FETCH_FOO::INITIALIZE',
      fetch: 'myComponent::FETCH_FOO::FETCH',
      cancel: 'myComponent::FETCH_FOO::CANCEL',
      reportError: 'myComponent::FETCH_FOO::REPORT_ERROR',
      handleError: 'myComponent::FETCH_FOO::HANDLE_ERROR',
      reportSuccess: 'myComponent::FETCH_FOO::REPORT_SUCCESS',
      handleSuccess: 'myComponent::FETCH_FOO::HANDLE_SUCCESS'
    };
    const actual = dsm(mockOptions({
      actionStates: createFlatStates()
    })).actions;

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('nested state', assert => {
    const msg = 'should return action types corresponding with given transitions';

    const expected = {
      initialize: 'myComponent::FETCH_FOO::INITIALIZE',
      fetch: 'myComponent::FETCH_FOO::FETCH',
      cancel: 'myComponent::FETCH_FOO::CANCEL',
      reportError: 'myComponent::FETCH_FOO::REPORT_ERROR',
      handleError: 'myComponent::FETCH_FOO::HANDLE_ERROR',
      reportSuccess: 'myComponent::FETCH_FOO::REPORT_SUCCESS',
      handleSuccess: 'myComponent::FETCH_FOO::HANDLE_SUCCESS'
    };
    const actual = dsm(mockOptions()).actions;

    assert.same(actual, expected, msg);
    assert.end();
  });
});

test('dsm() reducer', nest => {
  nest.test('with unrestricted state', assert => {
    const msg = 'should transition to correct state';
    const action = {
      type: 'myComponent::FETCH_FOO::FETCH'
    };
    const reducer = dsm(mockOptions({
      actionStates: createFlatStates()
    })).reducer;

    const actual = reducer(undefined, action).status;
    const expected = 'fetching';

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('with unrestricted state', assert => {
    const msg = 'should deliver correct payload';

    const payload = {
      type: 'response',
      data: 'some data'
    };

    const action = {
      type: 'myComponent::FETCH_FOO::REPORT_SUCCESS',
      payload
    };
    const reducer = dsm(mockOptions({
      actionStates: createFlatStates()
    })).reducer;

    const actual = reducer(undefined, action);
    const expected = {
      status: 'success',
      payload,
      action
    };

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('with nested state', assert => {
    const msg = 'should transition to correct state';
    const action = {
      type: 'myComponent::FETCH_FOO::FETCH'
    };
    const reducer = dsm(mockOptions()).reducer;

    const actual = reducer(undefined, action).status;
    const expected = 'fetching';

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('with nested state', assert => {
    const msg = 'should ignore invalid action for current state';
    const action = {
      type: 'myComponent::FETCH_FOO::REPORT_ERROR'
    };
    const reducer = dsm(mockOptions()).reducer;

    const actual = reducer(undefined, action).status;
    const expected = 'idle';

    assert.same(actual, expected, msg);
    assert.end();
  });
});

test('action creators', nest => {
  nest.test('names', assert => {
    const msg = 'should return action creators with correct names';

    const expected = [
      'initialize',
      'fetch',
      'cancel',
      'reportError',
      'handleError',
      'reportSuccess',
      'handleSuccess'
    ];

    const pipeline = pipe(
      dsm,
      obj => obj.actionCreators,
      Object.keys
    );
    const actual = pipeline(mockOptions({
      actionStates: createFlatStates()
    }));

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('functions', assert => {
    const msg = 'should handle undefined payload and meta';

    const expected = {
      type: 'myComponent::FETCH_FOO::REPORT_SUCCESS'
    };

    const pipeline = pipe(
      dsm,
      obj => obj.actionCreators.reportSuccess()
    );
    const actual = pipeline(mockOptions({
      actionStates: createFlatStates()
    }));

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('functions', assert => {
    const msg = 'should return correct actions';

    const payload = 'some data';

    const expected = {
      type: 'myComponent::FETCH_FOO::REPORT_SUCCESS',
      payload
    };

    const pipeline = pipe(
      dsm,
      obj => obj.actionCreators.reportSuccess(payload)
    );
    const actual = pipeline(mockOptions({
      actionStates: createFlatStates()
    }));

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('payloads', assert => {
    const msg = 'new state should reflect action payloads';

    const payload = 'some data';

    const request = dsm(mockOptions({
      actionStates: createFlatStates()
    }));
    const action = request.actionCreators.reportSuccess(payload);
    const actual = request.reducer(undefined, action);
    const expected = {
      status: 'success',
      payload,
      action
    };

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('error', assert => {
    const msg = 'new state should reflect action errors';

    const payload = new Error('fetching error');

    const request = dsm(mockOptions({
      actionStates: createFlatStates()
    }));
    const actual = request.actionCreators.reportError(payload);
    const expected = {
      type: 'myComponent::FETCH_FOO::REPORT_ERROR',
      payload,
      error: true
    };

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('meta', assert => {
    const msg = 'new state should reflect meta data';

    const payload = { userId: 1 };
    const meta = { admin: true };

    const request = dsm(mockOptions({
      actionStates: createFlatStates()
    }));
    const actual = request.actionCreators.reportSuccess(payload, meta);
    const expected = {
      type: 'myComponent::FETCH_FOO::REPORT_SUCCESS',
      payload,
      meta
    };

    assert.same(actual, expected, msg);
    assert.end();
  });
});
