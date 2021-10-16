import { saveObjectInLocalStorage, getObjectFromLocalStorage, removeObjectFromLocalStorage } from '../utils/utils.js';

window.freezeSettings = {};

const saveSites = document.querySelector('#save-sites');
const sitesToFreeze = document.querySelector('#sites-to-freeze');
const clearCache = document.querySelector('#clear-cache');
const changeFreezeStatus = document.querySelector('#change-freeze-status');
const freezeStatus = document.querySelector('#freeze-status');
const storageData = document.querySelector('#storage-data');


class Options {

    static setPageContent = async () => {
        await this.setSavedSitesToFreeze();
        await this.setFreezeStatus();
        await this.setStorageData();
    }

    static setSavedSitesToFreeze = async () => {
        const savedSitesToFreeze = await getObjectFromLocalStorage(['sitesToFreeze']);
        sitesToFreeze.value = savedSitesToFreeze;
        window.freezeSettings.savedSitesToFreeze = savedSitesToFreeze;
    }

    static setFreezeStatus = async () => {
        const currentFreezeStatus = await getObjectFromLocalStorage(['freezeStatus']);
        changeFreezeStatus.innerText = currentFreezeStatus ? 'Disable freezing' : 'Enable freezing';
        freezeStatus.innerText = currentFreezeStatus ? 'enabled' : 'disabled';
    
        window.freezeSettings.freezeStatus = currentFreezeStatus;
    }

    static setStorageData = async () => {
        const data = await getObjectFromLocalStorage('GET_EVERYTHING');
        if (!data) return;
        for (let key in data) {
            if (data[key].document) delete data[key].document;
        }
        storageData.innerText = JSON.stringify(data, null, 4);
    }

    static saveSitesListener = async e => {
        await saveObjectInLocalStorage({
            sitesToFreeze: sitesToFreeze.value
        });
        await this.setStorageData();
        console.log('Saved sites to freeze');
    }

    static clearCacheListener = async e => {
        const sites = sitesToFreeze.value.split(',').map(site => site.trim());
        await removeObjectFromLocalStorage(sites);
        await this.setStorageData();
    }

    static changeFreezeStatusListener = async e => {
        if (!window.freezeSettings.hasOwnProperty('freezeStatus')) return;
        const newFreezeStatus = !window.freezeSettings.freezeStatus;
        await saveObjectInLocalStorage({
            freezeStatus: newFreezeStatus
        });
        window.freezeSettings.freezeStatus = newFreezeStatus;
        changeFreezeStatus.innerText = newFreezeStatus ? 'Disable freezing' : 'Enable freezing';
        freezeStatus.innerText = newFreezeStatus ? 'enabled' : 'disabled';
        await this.setStorageData();
    }
}

Options.setPageContent();

saveSites.addEventListener('click', Options.saveSitesListener);
clearCache.addEventListener('click', Options.clearCacheListener);
changeFreezeStatus.addEventListener('click', Options.changeFreezeStatusListener);