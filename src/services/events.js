export const createEventSource = (topics) => {
    const url = new URL(process.env.REACT_APP_MERCURE_HOST);

    for (const topic of topics) {
        url.searchParams.append('topic', process.env.REACT_APP_CLIENT_HOST + topic);
    }

    return new EventSource(url);
};
