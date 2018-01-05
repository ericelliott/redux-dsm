import { describe } from 'riteway';

import dsm from '../dsm';

const actionStates = [
  ['initialize', 'signed out',
    ['sign in', 'authenticating'
      // ['report error', 'error',
      //   ['handle error', 'signed out']
      // ],
      // ['sign-in success', 'signed in']
    ]
  ]
];

const { initialize, reducer, signIn } = dsm({
  component: 'user-authentication',
  description: 'authenticate user',
  actionStates
});


const createState = ({
  status = 'signed out',
  payload: { type = 'empty'} = {}
} = {}) => ({ status, payload: { type } });

describe('userAuthenticationReducer', async should => {
  {
    const {assert} = should('use "signed out" as initialized state');

    assert({
      given: '["initialize", "signed out", /*...*/',
      actual: reducer(),
      expected: createState()
    });
  }

  {
    const {assert} = should('transition into authenticating state');
    const initialState = reducer(undefined, initialize());

    assert({
      given: 'signed out initial state & signIn action',
      actual: reducer(initialState, signIn()),
      expected: createState()
    });
  }
});
