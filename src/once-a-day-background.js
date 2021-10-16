import { saveObjectInLocalStorage } from './utils/utils.js';

const handleCache = async (request, sender) => {
    const storageValue = {};
    storageValue[request.url] = request;
    await saveObjectInLocalStorage(storageValue);
    console.log('Cached', request.url);
    return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleCache(request, sender).then(sendResponse);
    return true;
});

