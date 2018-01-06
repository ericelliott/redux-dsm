import { describe } from 'riteway';

import dsm from '../dsm';

const SIGNED_OUT = 'signed_out';
const AUTHENTICATING = 'authenticating';

const actionStates = ['initial', SIGNED_OUT,
  ['sign in', AUTHENTICATING
    // ['report error', 'error',
    //   ['handle error', 'signed out']
    // ],
    // ['sign-in success', 'signed in']
  ]
];

const { reducer, actionCreators: { signIn } } = dsm({
  component: 'user-authentication',
  description: 'authenticate user',
  actionStates
});


describe('userAuthenticationReducer', async should => {
  {
    const {assert} = should('use "signed out" as initialized state');

    assert({
      given: '["initial", "signed out", /*...*/',
      actual: reducer().status,
      expected: SIGNED_OUT
    });
  }

  {
    const {assert} = should('transition into authenticating state');

    assert({
      given: 'signed out initial state & signIn action',
      actual: reducer(undefined, signIn()).status,
      expected: AUTHENTICATING
    });
  }
});
