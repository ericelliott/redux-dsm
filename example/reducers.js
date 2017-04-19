import {combineReducers} from 'redux';

import {reducer as listReducer} from './dsm';

export const rootReducer = combineReducers({
    list: listReducer
});
