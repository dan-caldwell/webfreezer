const utilsURL = chrome.runtime.getURL('src/utils/utils.js');

window.webFreezer = {
    enabled: false,
    siteFreezeInfo: null
};

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
        url: location.href
    }, () => {
        console.log('Cached site');
    });
}

window.addEventListener('DOMContentLoaded', async e => {
    const utils = await import(utilsURL);
    const freezingEnabled = await utils.getObjectFromLocalStorage(['freezeStatus']);
    if (!freezingEnabled) return;
    const sitesToFreeze = await utils.getObjectFromLocalStorage(['sitesToFreeze']);
    if (!sitesToFreeze) return;
    const formattedSitesToFreeze = sitesToFreeze.split(',');
    const inFrozenSites = formattedSitesToFreeze.find(site => window.location.href === site.trim());
    if (!inFrozenSites) return;
    console.log('Freezing enabled on', location.href);
    const siteFreezeInfo = await utils.getObjectFromLocalStorage([location.href]);
    if (siteFreezeInfo && shouldReturnCached(new Date().toString(), siteFreezeInfo.date)) {
        document.body.innerHTML = siteFreezeInfo.document;
        console.log('Replaced body with cached value');
    } else {
        await timeout(2000);
        sendCacheInfo();
    }
    window.webFreezer = {
        enabled: true,
        siteFreezeInfo
    }
});

window.addEventListener('load', async () => {
    const { siteFreezeInfo, enabled } = window.webFreezer;
    if (!enabled) return;
    if (!siteFreezeInfo) {
        await timeout(2000);
        sendCacheInfo();
        return;
    }
});