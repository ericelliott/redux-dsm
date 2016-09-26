import test from 'tape';
import { flow as pipe } from 'lodash';

import dsm from '../dsm';

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

test('dsm() action types', nest => {
  nest.test('flat state', assert => {
    const msg = 'should return action types corresponding with given transitions';

    const expected = [
      'myComponent::FETCH_FOO::INITIALIZE',
      'myComponent::FETCH_FOO::FETCH',
      'myComponent::FETCH_FOO::CANCEL',
      'myComponent::FETCH_FOO::REPORT_ERROR',
      'myComponent::FETCH_FOO::HANDLE_ERROR',
      'myComponent::FETCH_FOO::REPORT_SUCCESS',
      'myComponent::FETCH_FOO::HANDLE_SUCCESS'
    ];
    const actual = dsm(mockOptions({
      actionStates: createFlatStates()
    })).actions;

    assert.same(actual, expected, msg);
    assert.end();
  });

  nest.test('nested state', assert => {
    const msg = 'should return action types corresponding with given transitions';

    const expected = [
      'myComponent::FETCH_FOO::INITIALIZE',
      'myComponent::FETCH_FOO::FETCH',
      'myComponent::FETCH_FOO::CANCEL',
      'myComponent::FETCH_FOO::REPORT_ERROR',
      'myComponent::FETCH_FOO::HANDLE_ERROR',
      'myComponent::FETCH_FOO::REPORT_SUCCESS',
      'myComponent::FETCH_FOO::HANDLE_SUCCESS'
    ];
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
      payload
    };

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
      payload
    };

    assert.same(actual, expected, msg);
    assert.end();
  });
});
