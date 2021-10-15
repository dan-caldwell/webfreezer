import { saveObjectInLocalStorage, getObjectFromLocalStorage, removeObjectFromLocalStorage } from '../utils/utils.js';

window.freezeSettings = {};

const saveSites = document.querySelector('#save-sites');
const sitesToFreeze = document.querySelector('#sites-to-freeze');
const clearCache = document.querySelector('#clear-cache');
const changeFreezeStatus = document.querySelector('#change-freeze-status');
const freezeStatus = document.querySelector('#freeze-status');

window.addEventListener('DOMContentLoaded', async () => {
    const savedSitesToFreeze = await getObjectFromLocalStorage(['sitesToFreeze']);
    sitesToFreeze.value = savedSitesToFreeze;

    // Set freeze status
    const currentFreezeStatus = await getObjectFromLocalStorage(['freezeStatus']);
    changeFreezeStatus.innerText = currentFreezeStatus ? 'Disable freezing' : 'Enable freezing';
    freezeStatus.innerText = currentFreezeStatus ? 'enabled' : 'disabled';

    window.freezeSettings.savedSitesToFreeze = savedSitesToFreeze;
    window.freezeSettings.freezeStatus = currentFreezeStatus;
});

saveSites.addEventListener('click', async () => {
    await saveObjectInLocalStorage({
        sitesToFreeze: sitesToFreeze.value
    });
    console.log('Saved sites to freeze');
});

clearCache.addEventListener('click', async () => {
    const sites = sitesToFreeze.value.split(',').map(site => site.trim());
    await removeObjectFromLocalStorage(sites);
});

changeFreezeStatus.addEventListener('click', async () => {
    if (!window.freezeSettings.hasOwnProperty('freezeStatus')) return;
    const newFreezeStatus = !window.freezeSettings.freezeStatus;
    await saveObjectInLocalStorage({
        freezeStatus: newFreezeStatus
    });
    window.freezeSettings.freezeStatus = newFreezeStatus;
    changeFreezeStatus.innerText = newFreezeStatus ? 'Disable freezing' : 'Enable freezing';
    freezeStatus.innerText = newFreezeStatus ? 'enabled' : 'disabled';
});