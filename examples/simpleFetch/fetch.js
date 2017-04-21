export const getCommits = () => {
    return fetch("https://api.github.com/repos/bognix/hajs-sie-zgadza/commits")
        .then((response) => {
            return response.json()
        });
};
