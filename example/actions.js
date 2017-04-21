import {getCommits} from './fetch';
import {actionCreators} from './dsm';

export const fetchCommits = () => {
    return (dispatch) => {
        dispatch(actionCreators.fetch());

        getCommits()
            .then((json) => {
                const messages = json.map((item) => {
                    return {
                        text: item.commit.message,
                        author: item.commit.author.name
                    };
                });

                return dispatch(actionCreators.reportSuccess()) && dispatch(actionCreators.handleSuccess({messages}));
            }).catch((error) => dispatch(actionCreators.reportError({error})) && dispatch(actionCreators.handleError({error})));
    };
};
