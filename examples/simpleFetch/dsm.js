import dsm from 'redux-dsm';

export const STATUS = {
    FETCHING: 'fetching',
    IDLE: 'idle',
    SUCCESS: 'success',
    ERROR: 'error'
};

const fetchingStates = [
    ['initialize', STATUS.IDLE,
        ['fetch', STATUS.FETCHING,
            ['cancel', STATUS.IDLE],
            ['report error', STATUS.ERROR,
                ['handle error', STATUS.IDLE]
            ],
            ['report success', STATUS.SUCCESS,
                ['handle success', STATUS.IDLE]
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
