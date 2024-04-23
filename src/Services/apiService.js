const apiBaseURL = "http://m.pasturecoachnz.co.nz";
const summariesBaseURL = "http://pasturecoachnz.co.nz/api/";

export const apiCall = (data, headers, onSuccess, onError) => {
    const fullURL = `${apiBaseURL}/m/farms`;

    const handleSuccess = (response) => {
        const responseJson = JSON.parse(response.data);
        onSuccess(responseJson);
    };

    const handleError = (response) => {
        let error = "Unknown Error";
        try {
            const responseJson = JSON.parse(response.error);
            error = responseJson.message || error;
        } catch (parseError) {
            console.log(parseError);
        }
        onError(error);
    };

    if (window.cordova) {
        cordova.plugin.http.setDataSerializer('json');
        cordova.plugin.http.post(fullURL, data, headers, handleSuccess, handleError);
    } else {
        fetch("/m/farms", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(onSuccess)
        .catch(onError);
    }
};
