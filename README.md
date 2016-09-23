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

// ({ actionStates: Array, component?: String, name?: String, delimiter?: String }) => { Actions, ActionCreators, Reducer }
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
