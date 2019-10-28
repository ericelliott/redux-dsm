import { describe } from 'riteway';

import dsm from '../dsm';

const SIGNED_OUT = 'signed out';
const AUTHENTICATING = 'authenticating';
const ERROR = 'error';
const SIGNED_IN = 'signed in';

const slice = 'user-authentication';

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
  },
  getStatus
} = dsm({
  component: slice,
  description: 'authenticate user',
  actionStates
});


describe('userAuthenticationReducer', async assert => {
  {
    const should = 'use "signed out" as initialized state';

    assert({
      given: '["initial", "signed out", /*...*/',
      should,
      actual: getStatus({ [slice]: reducer() }),
      expected: SIGNED_OUT
    });
  }

  {
    const should = 'transition into authenticating state';

    assert({
      given: 'signed out initial state & signIn action',
      should,
      actual: getStatus({ [slice]: reducer(undefined, signIn()) }),
      expected: AUTHENTICATING
    });
  }

  {
    const should = 'transition into "signed in" state';
    const initialState = reducer(undefined, signIn());

    assert({
      given: '"authenticating" initial state & reportSignInSuccess action',
      should,
      actual: getStatus({ [slice]: reducer(initialState, reportSignInSuccess()) }),
      expected: SIGNED_IN
    });
  }

  {
    const should = 'transition into "signed in" state';

    assert({
      given: '"signed out" initial state & reportSignInSuccess action',
      should,
      actual: getStatus({ [slice]: reducer(undefined, reportSignInSuccess()) }),
      expected: SIGNED_IN
    });
  }
});
