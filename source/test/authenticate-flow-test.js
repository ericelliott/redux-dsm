import { describe } from 'riteway';

import dsm from '../dsm';

const SIGNED_OUT = 'signed out';
const AUTHENTICATING = 'authenticating';
const ERROR = 'error';
const SIGNED_IN = 'signed in';

const actionStates = ['initial', SIGNED_OUT,
  ['sign in', AUTHENTICATING,
    ['report sign in failure', ERROR,
      ['handle sign in failure', SIGNED_OUT]
    ],
    ['report sign in success', SIGNED_IN,
      ['sign out', SIGNED_OUT]
    ]
  ],
  ['report sign in success', SIGNED_IN,
    ['sign out', SIGNED_OUT]
  ]
];

const {
  reducer,
  actionCreators: {
    signIn,
    reportSignInSuccess
  }
} = dsm({
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

  {
    const {assert} = should('transition into "signed in" state');
    const initialState = reducer(undefined, signIn());

    assert({
      given: '"authenticating" initial state & reportSignInSuccess action',
      actual: reducer(initialState, reportSignInSuccess()).status,
      expected: SIGNED_IN
    });
  }

  {
    const {assert} = should('transition into "signed in" state');

    assert({
      given: '"signed out" initial state & reportSignInSuccess action',
      actual: reducer(undefined, reportSignInSuccess()).status,
      expected: SIGNED_IN
    });
  }
});
