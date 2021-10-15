const utilsURL = chrome.runtime.getURL('src/utils/utils.js');

const timeout = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const shouldReturnCached = (currentDate, oldDate) => {
    const currentDateObj = new Date(currentDate);
    const oldDateObj = new Date(oldDate);
    return (
        currentDateObj.getFullYear() === oldDateObj.getFullYear() &&
        currentDateObj.getMonth() === oldDateObj.getMonth() &&
        currentDateObj.getDate() === oldDateObj.getDate()
    );
}

const sendCacheInfo = () => {
    chrome.runtime.sendMessage({
        date: new Date(),
        document: document.body.innerHTML,
        host: location.host
    }, () => {
        console.log('Cached site');
    });
}

window.addEventListener('load', async () => {
    const utils = await import(utilsURL);
    const freezingEnabled = await utils.getObjectFromLocalStorage(['freezeStatus']);
    if (!freezingEnabled) return;
    const sitesToFreeze = await utils.getObjectFromLocalStorage(['sitesToFreeze']);
    if (!sitesToFreeze) return;
    const formattedSitesToFreeze = sitesToFreeze.split(',');
    const inFrozenSites = formattedSitesToFreeze.find(site => window.location.href.includes(site.trim()));
    if (!inFrozenSites) return;
    console.log('Freezing enabled on', location.host);
    const siteFreezeInfo = await utils.getObjectFromLocalStorage([location.host]);
    if (!siteFreezeInfo) {
        await timeout(2000);
        sendCacheInfo();
        return;
    }
    if (shouldReturnCached(new Date().toString(), siteFreezeInfo.date)) {
        document.body.innerHTML = siteFreezeInfo.document;
        console.log('Replaced body with cached value');
    } else {
        await timeout(2000);
        sendCacheInfo();
    }
});