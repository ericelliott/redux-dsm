# Redux DSM

Declarative State Machines for Redux: An async state boilerplate reducer.

## Status

Developer preview / proof of concept / idea phase. Not production tested, yet. Currently you can transition from any state to any other state. In the future, we'll only transition to valid next states based on the state tree you pass in.


## Install

```sh
npm install --save redux-dsm
```

And then in your file :

```js
import dsm from 'redux-dsm';
```

Or using CommonJS modules :

```js
var dsm = require('redux-dsm');
```


## Why?

Your state isn't always available synchronously all the time. Some state has to be loaded asynchronously, which requires you to cycle through UI states representing concepts like fetching, processing, error, success, and idle states. In fact, a simple ajax fetch might have up to 7 transitions leading into 4 different states:

```
Transition        Next Status
['initialize',        'idle']
['fetch',         'fetching']
['cancel',            'idle']
['report error',     'error']
['handle error',      'idle']
['report success', 'success']
['handle success',    'idle']
```

Your view code will look at the status and payload to determine whether or not to render spinners, success messages, error messages, empty states, or data. I don't know about you, but I sometimes forget some of those transitions or states.

Every app I've ever written needs to do this a bunch of times. Since I switched to Redux, I handle all off my view state transitions by dispatching action objects, and that requires writing a bunch of boilerplate, such as action types (e.g., `myComponent::FETCH_FOO::INITIALIZE`), and action creators (which your view or service layers can call to create actions without forcing you to import all those action type constants everywhere).

This little library takes a few declarative inputs and spits out all of the boilerplate for you, including a mini reducer that you can combine with your feature-level reducers.

## Can I Use it With *x*?

This library is not just for ajax, though that will be a very common use-case, and it doesn't care how you handle your async I/O. You can use it with [Sagas](https://github.com/yelouafi/redux-saga), [Ogen](https://github.com/ericelliott/ogen), etc..., or just use it by itself and manually wire up your async I/O.

You don't even have to use it with Redux -- anything that uses reducer-based state is fine, including [ngrx/store](https://github.com/ngrx/store) or even `Array.prototype.reduce()`.


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

// ({
//   component?: String,
//   description?: String,
//   actionStates: Array,
//   delimiter?: String
// }) => { actions: Array, actionCreators: Object, reducer: Function }
const foo = dsm({
  component: 'myComponent',
  description: 'fetch foo',
  actionStates: fetchingStates
});
```

## .actions: [...String]

`actions` is an array of strings. If you use the returned `.actionCreators`, you probably don't need to use these, but it's handy for debugging. For the above example, it returns:

```js
  "actions": [
    "myComponent::FETCH_FOO::INITIALIZE",
    "myComponent::FETCH_FOO::FETCH",
    "myComponent::FETCH_FOO::CANCEL",
    "myComponent::FETCH_FOO::REPORT_ERROR",
    "myComponent::FETCH_FOO::HANDLE_ERROR",
    "myComponent::FETCH_FOO::REPORT_SUCCESS",
    "myComponent::FETCH_FOO::HANDLE_SUCCESS"
  ]
```

## .actionCreators: Object

`actionCreators` will be an object with camelCased keys and function values corresponding to your state transitions. For each transition, an action creator is created which will automatically fill in the correct action type, and pass through `payload` to the state.

The example fetch state machine will produce the following `actionCreators`:

```js
initialize()
fetch()
cancel()
reportError()
handleError()
reportSuccess()
handleSuccess()
```

## .reducer: (state, action) => state

`.reducer()` is a normal Redux reducer function that takes the current state and an action object, and returns the new state. Matching action objects can be created using the `.actionCreators`. The reducer can be combined with a parent reducer using `combineReducers()`. Any payload passed into an action creator will be passed through to `state.payload`.

## State: { status: String, payload: Any }

The state object will have two keys, `status` and `payload`. In the example above, `status` will be one of `idle`, `fetching`, `error`, or `success`.

By default, the `payload` key is an object with `type: 'empty'`.
