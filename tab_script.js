var thisTabID;

function setCurrentTab() {
    var thisID;
    chrome.tabs.getCurrent(function(tab) {
        thisID = tab.id;
        thisTabID = tab.id;
        // alert(tab.id);
    })
    // thisTabID = thisID;
    return thisID;
}

let tablePop = document.getElementById('propTable');
let savedTable = document.getElementById('savedTabsTable');

var tableCounter = 0;
function tableCreator() {

}
function fillTabRow(properties) {
    let tableContent = "<tr><th>Prop</th><th>Value</th></tr>";
    for(key in properties) {
        let newRow = "<tr>";
        newRow += "<td>" + key + "</td>";
        newRow += "<td>" + properties[key] + "</td>";
        newRow += "</tr>";
        tableContent += newRow;
    }
    // @TODO: This violates CSP directives. Better to first populate the table, then inject the tab-closing action into them
    // var closer = "<tr><td><span class=\"closeBtn\" onclick=\"alert(\"Del\")\">X</span></td></tr>";
    return tableContent+closer;
}
function tableAppender(tableID, htmlContent) {
    tableID.innerHTML += htmlContent;
}
function clearTable(tableID) {
    tableID.innerHTML = null;
}
function getTabInfo(tab, index) {
//     tab.id, tab.index, tab.windowId, tab.highlighted, tab.pinned, tab.active, tab.url, 
// tab.pendingUrl, tab.title, tab.favIconUrl;
    let infoHeads = {
        "ID": tab.id, 
        "Index": tab.index, 
        "WindowID": tab.windowId, 
        "Highlighted": tab.highlighted, 
        "Pinned": tab.pinned, 
        "Active": tab.active, 
        "URL": tab.url, 
        "Pending URL": tab.pendingUrl, 
        "Title": tab.title, 
        "FaviconURL": tab.favIconUrl
    };
    return fillTabRow(infoHeads);
}
let currentTabs = [];
// put it into tab creation - compress each new tab to currentTabs
function tabCompressor(tab) {
    let newTab = {
        "id": tab.id, 
        "index": tab.index, 
        "url": tab.url, 
        "title": tab.title, 
        "favurl": tab.favIconUrl
    }
    currentTabs.push(newTab);
}
function tabInflator(tabInfo) {
    chrome.tabs.create({url: tabInfo["url"], index: tabInfo["index"], active: false});
}
function getTabStub(tab, index) {
    let infoHeads = {
        "ID": tab.id, 
        "Index": tab.index, 
        "URL": tab.url, 
        "Title": tab.title, 
        "FaviconURL": tab.favIconUrl
    }
    if(tab.id != thisTabID) {
        tabCompressor(tab);
        tableAppender(tablePop, fillTabRow(infoHeads));
        console.log(currentTabs);
    }
}
function populateCurrentTabsTable() {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach(getTabStub);
    });
}
let saveTabsBtn = document.getElementById('saveBtn');
let tabInfoBox = document.getElementById('tabInfo');

saveTabsBtn.addEventListener("click", function() {
    for(var i = 0; i < currentTabs.length; i++) {      
        tableAppender(savedTable, fillTabRow(currentTabs[i]));
        chrome.tabs.remove(currentTabs[i]["id"]);
    }
    console.log("Saved");
    clearTable(tablePop);
    populateCurrentTabsTable();
});

window.addEventListener("load", function() {
    setCurrentTab();
    console.log("Current ID: " + thisTabID);
    populateCurrentTabsTable();
});
