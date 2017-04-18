import {
    combineReducers
} from 'redux';

const listReducer = (items = [], action) => {
    switch (action.type) {
        case "REQUEST_COMMITS_STARTED":
            return items;
        case "REQUEST_COMMITS_FINISHED":
            return [
                ...action.items
            ];

        default:
            return items;
    }
};

export const rootReducer = combineReducers({
    items: listReducer
});
