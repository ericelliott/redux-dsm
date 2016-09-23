# Dream code + API noodling

```
// ['action', 'next state',
//   ['scoped action', 'another state']
// ]

const fetchingStates = [
  ['idle', 'idle',
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

const formatConstant = text => (
  text.split(' ').join('_').toUpperCase()
);

const none = {
  type: 'none'
};

const some = value => ({
  type: 'some',
  value
});

const err = error => ({
  type: 'error',
  error
});

const defaultState = {
  status: 'idle',
  data: none
};

const dsm = ({
  component = '',
  label = '',
  delimiter = '::',
  actionStates = {}
}) => {
  const actionMap = actionStates.map(a => {
    const action = component + [
      component ? delimiter : '',
      label,
      label ? delimiter : '',
      a[0]
    ].map(formatConstant).join('');
    const status = a[1];

    return {
      action,
      status
    };
  });
  const actions = actionMap.map(a => a.action);

  const reducer = (state = defaultState, action = {}) => {
    // see https://github.com/mheiber/redux-machine
  };

  return {
    actions,
    actionCreators: {},
    reducer
  }
};

const foo = dsm({
  component: 'myComponent',
  label: 'fetch foo',
  actionStates: fetchingStates
});

console.log(foo);

const defaults = foo.reducer();

const action = {
  type: 'MY_COMPONENT::FETCH_FOO::FETCH'
};

const newState = foo.reducer(undefined, action);
console.log(newState);

const curry = fn => (...args) => fn.bind(null, ...args);

// "cata" is short for "catamorphism" but
// I like to think of it as short for "catalog".
// Think of it like this:
// Given a catalog of handlers,
// and data of some specific type,
// the appropriate handler will be looked up by type
// and applied to the data.
const cata = curry((handlers, data) => {
  const { type } = data;
  if (typeof handlers[type] === 'function') return handlers[type](data);
});
```
