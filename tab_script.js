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
function tableCreator(properties) {
    let tableContent = "<tr><th>Prop</th><th>Value</th></tr>";
    for(key in properties) {
        let newRow = "<tr>";
        newRow += "<td>" + key + "</td>";
        newRow += "<td>" + properties[key] + "</td>";
        newRow += "</tr>";
        tableContent += newRow;
    }
    return tableContent;
}
function tableAppender(table, htmlContent) {
    table.innerHTML += htmlContent;
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
    return tableCreator(infoHeads);
}
let currentTabs = [];
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
        tableAppender(tablePop, tableCreator(infoHeads));
        console.log(currentTabs);
    }
}
let saveTabsBtn = document.getElementById('saveBtn');
let tabInfoBox = document.getElementById('tabInfo');
let savedTable = document.getElementById('savedTabsTable');

saveTabsBtn.addEventListener("click", function() {

});

window.addEventListener("load", function() {
    setCurrentTab();
    alert("Current ID: " + thisTabID);
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach(getTabStub);

    });
});
