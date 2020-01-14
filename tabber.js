// Extra functions for debugging
/**
 * Function to sleep
 * @param {int} milliseconds 
 */
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}
/**
 * Debug message that alerts
 */
function helloWorld() {
    alert("Hello World");
}

/**
 * Function that returns basic JSON info from a given tab - serializes Chrome tab objects
 * @param {Object} tab  A Chrome tab
 * @return {JSON}       Select tab properties
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
 * Function that returns an HTML object by populating tab fields from a serialized tab given in JSON
 * @param {JSON} tab_info   The information for a tab in JSON format
 * @return {string}         The formatted string to output HTML of the tab
 */ 
function tileInflator(tab_info) {
    var tileEmpty = `<div class="tabTile">
    <h2>${tab_info.title}</h2>
    <img src="${tab_info.favUrl}" alt="">
    <p>${tab_info.url}</p>
    <p>${tab_info.id}</div>`;
    return tileEmpty;
}

/**
 * Function that validates tabs to prevent addition of invalid and unnecessary tabs 
 * @param {Object} tab Validates tab from its Chrome tab object representation for addition to arrays and lists
 */
function isTabValid(tab) {
    if(tab["status"]=="loading") {
        return false;
    }
    if(tab["url"]=="chrome://newtab/" || tab["url"]=="chrome://newtab") {
        return false;
    }
    return true;
}
// reference to the HTML panel containing the currently opened tabs
var currentTabsPanel = document.getElementById('currentTabsPanel');
// list of current tabs - serialized
var currentTabList = [];

/**
 * Function that appends an inflated tab into a tab panel
 * @param {string} tab_tile             The HTML representation of tab serialized from tileInflator
 * @param {object} destination_panel    The object to which to add this tab
 */
function appendToPanel(tab_tile, destination_panel) {
    destination_panel.innerHTML += tab_tile;
}

/**
 * Populate the tab list on first launch
 * Manually fetch the tabs or @TODO pick the stored current tabs - see performance 
 */
function populateCurrentTabList() {
    let queryInfo = {
        currentWindow: true,
    };
    let tabList = chrome.tabs.query(queryInfo, function(tabArray) {
        tabArray.forEach(function(tab) {
            if(tab["url"] != 'chrome://newtab/') {
                console.log("Adding to array: ", tab["url"]);
                currentTabList.push(getTabInfo(tab));
            }
        });
    });
    console.log("Populated currentTabList", currentTabList);
}
/**
 * Function to search for a tab given its tab index
 * @param {integer} tab_id  Index of tab to look for
 * @return {integer}        Index in the array
 */
function searchForTab(tab_id) {
    for(var i = 0; i < currentTabList.length; i++) {
        if(currentTabList[i]["id"] == tab_id)
            return i;
    }
    return -1;
}
/**
 * Function to update tab tile
 * @param {object}  tab     A Chrome tab object
 */
function updateTile(tab) {
    let tab_idx = searchForTab(tab["id"]);
    if(tab_idx == -1) {
        console.log("No such tab exists");
        return;
    }
    let currentTabTiles = document.querySelectorAll("#currentTabsPanel > .tabTile");
    currentTabTiles.forEach(function(tile) {
        /**
         * @TODO
         * Update the inner HTML. How? Create own custom HTML attribute to keep ID separate? Traverse the tile for the tab ID and then update it all?
         */
        // if(tile)
    });
    console.log(currentTabTiles);
}

// New tab created - fetch all tiles through query. Save them to list.
// Use list to create tiles
// Creation, updation, (deletion, removal) after that - have listeners
// Can save to local
function tabTileInit() {
    populateCurrentTabList();
    // sleep(1000);
    /**
     * @TODO
     * Does not work right after population. Need to wait for populate query to finish?
     */
    currentTabList.forEach(function(tab_info) {
        console.log("Adding to panel: ");
        console.log(tab_info);
        // let tile = tileInflator(tab_info);
        // console.log(tile);
        // appendToPanel(tile, currentTabsPanel);
    });
    alert("Added 'em all")
}
chrome.tabs.onCreated.addListener(function(tab) {
    console.log("Create: ");
    let createdTabInfo = getTabInfo(tab);
    console.log(createdTabInfo);
    currentTabList.push(createdTabInfo);
    console.log(currentTabList);
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo["status"]=="complete") {
        console.log("Update completed: ");
        console.log(changeInfo);
        let updatedTabInfo = getTabInfo(tab);
        let tabHTML = tileInflator(updatedTabInfo);
        console.log(tabHTML);
        appendToPanel(tabHTML, currentTabsPanel);
        updateTile(tab);
    }
});

manualTriggerBtn = document.getElementById("manualTrigger");
manualTriggerBtn.addEventListener("click", tabTileInit);