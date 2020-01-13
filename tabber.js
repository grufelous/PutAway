/**
 * function that returns basic JSON info from a given tab - serializes Chrome tab objects
 */
function getTabInfo(tab) {
    let tabProps = {
        "id": tab.id,
        "index": tab.index,
        "url": tab.url,
        "title": tab.title,
        "favUrl": tab.favIconUrl
    };
    return tabProps;
}

/**
 * function that returns an HTML object by populating tab fields from a serialized tab given in JSON
 */ 
function tileInflator(tab_info) {
    var tileEmpty = `<div class="tabTile">
    <h2>${tab_info.title}</h2>
    <img src="${tab_info.favUrl}" alt="">
    <p>${tab_info.url}</p></div>`;
    return tileEmpty;
}

var currentTabsPanel = document.getElementById('currentTabsPanel');
/**
 * function that appends an inflated tab into a tab panel
 */
function appendToPanel(tab_tile, destination_panel) {
    destination_panel.innerHTML += tab_tile;
}
chrome.tabs.onCreated.addListener(function(tab) {
    console.log("Create: ");
    console.log(getTabInfo(tab));
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo["status"]=="complete") {
        console.log("Update: ");
        console.log("update type: ");
        console.log(changeInfo);
        let updatedTabInfo = getTabInfo(tab);
        let tabHTML = tileInflator(updatedTabInfo);
        console.log(tabHTML);
        appendToPanel(tabHTML, currentTabsPanel);
    }
});