# Redux DSM

Declarative State Machines for Redux

## Status

Unfinished. Here be dragons.

## Usage Example

```js
import dsm from 'redux-dsm';

// ['action', 'next state',
//   ['scoped action', 'another state']
// ]
// e.g., in the following example, from 'fetching' state, we can:
// * cancel
// * report an error
// * report success
const fetchingStates = [
  ['initialize', 'idle',
    ['fetch', 'fetching',
      ['cancel', 'idle']
      ['report error', 'error',
        ['handle error', 'idle']
      ],
      ['report success', 'success',
        ['handle success', 'idle']
      ]
    ]
  ]
];

// ({ actionStates: Array, component?: String, name?: String, delimiter?: String }) =>
//   { actions: Array, ActionCreators: Object, Reducer: Function }
const foo = dsm({
  component: 'myComponent',
  name: 'fetch foo',
  actionStates: fetchingStates
});
```

`Actions` is an array of strings. For the above example, it returns:

```js
  "actions": [
    "myComponent::FETCH_FOO::INITIALIZE",
    "myComponent::FETCH_FOO::FETCH",
    "myComponent::FETCH_FOO::CANCEL",
    "myComponent::FETCH_FOO::REPORT_ERROR",
    "myComponent::FETCH_FOO::HANDLE_ERROR",
    "myComponent::FETCH_FOO::REPORT_SUCCESS",
    "myComponent::FETCH_FOO::HANDLE_SUCCESS",
  ]
```

## State

The state object will have two keys, `status`, `data`. In the example above, `status` will be one of `idle`, `fetching`, `error`, or `success`.

The `data` object will have a `type`, and:

* In the case of no data, no additional props
* If data exists, it will have a `value` prop with the value payload
* If the type is `error`, it will have an `error` prop with the error details

