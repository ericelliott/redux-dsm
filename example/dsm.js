import dsm from 'redux-dsm';

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

export const listDSM = dsm({
    component: 'List',
    description: 'Fetch Commits',
    actionStates: fetchingStates
});

export const actionCreators = listDSM.actionCreators;

export const reducer = listDSM.reducer;
