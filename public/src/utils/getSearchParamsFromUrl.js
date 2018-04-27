export default (history) => {
    return history.location.search
        .replace('?', '')
        .split('&')
        .reduce((acc, param) => {
            const parts = param.split('=');
            parts[0] && (acc[parts[0]] = parts[1]);

            return acc;
        }, {});
};