import { getCommits } from './fetch';

const requestCommitsStarted = () => {
    return {
        type: "REQUEST_COMMITS_STARTED",
    }
};

const requestCommitsFinished = (json) => {
    return {
        type: "REQUEST_COMMITS_FINISHED",
        items: json
    }
};

export function fetchCommits() {
    return function(dispatch) {
        dispatch(requestCommitsStarted());

        return getCommits().then((json) => {
            const messages = json.map((item) => {
                return {
                    message: item.commit.message,
                    author: item.commit.author.name
                }
            });

            dispatch(requestCommitsFinished(messages))
        });
    }
}
