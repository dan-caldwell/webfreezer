import { getObjectFromLocalStorage, saveObjectInLocalStorage } from './utils/utils.js';

const shouldReturnCached = (currentDate, oldDate) => {
    const currentDateObj = new Date(currentDate);
    const oldDateObj = new Date(oldDate);
    return (
        currentDateObj.getFullYear() === oldDateObj.getFullYear() &&
        currentDateObj.getMonth() === oldDateObj.getMonth() &&
        currentDateObj.getDate() === oldDateObj.getDate()
    );
}


const handleCache = async (request, sender) => {
    const storageValue = {};
    storageValue[request.host] = request;
    await saveObjectInLocalStorage(storageValue);
    console.log('Cached dates are different, not using cached value');
    console.log('Cached', request.host);
    return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleCache(request, sender).then(sendResponse);
    return true;
});

