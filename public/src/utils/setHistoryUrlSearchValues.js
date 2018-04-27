export default (history, searchValues) => {
    const searchParamsString = '?' + Object.keys(searchValues)
        .map(key => `${key}=${searchValues[key]}`)
        .join('&');

    const newLocation = history.location.pathname + searchParamsString;
    history.push(newLocation);
};