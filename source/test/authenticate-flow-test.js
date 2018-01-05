import { describe } from 'riteway';

import dsm from '../dsm';

const SIGNED_OUT = 'signed_out';
const AUTHENTICATING = 'authenticating';

const actionStates = [
  ['initialize', SIGNED_OUT,
    ['sign in', AUTHENTICATING
      // ['report error', 'error',
      //   ['handle error', 'signed out']
      // ],
      // ['sign-in success', 'signed in']
    ]
  ]
];

const { reducer, actionCreators: { initialize, signIn } } = dsm({
  component: 'user-authentication',
  description: 'authenticate user',
  actionStates
});


const createState = ({
  status = SIGNED_OUT,
  payload = { type: 'empty' }
} = {}) => ({ status, payload });

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
      expected: createState({ status: 'authenticating' })
    });
  }
});
