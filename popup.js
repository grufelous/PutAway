// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//     // let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.executeScript(
//             tabs[0].id,
//             {code: 'document.body.style.backgroundColor = "' + color + '";'}
//         );
//     });
// };
// let selfTabID = chrome.tabs
let tablePop = document.getElementById('propertyTable');
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
function getTabStub(tab, index) {
    let infoHeads = {
        "ID": tab.id, 
        "Index": tab.index, 
        "URL": tab.url, 
        "Title": tab.title, 
    }
    tableAppender(tablePop, tableCreator(infoHeads));
}
let getTabsBtn = document.getElementById('getTabs');
let tabInfoBox = document.getElementById('tabInfo');
getTabsBtn.onclick = function(element) {
    alert("Clicked");
    // It returns undefined because called from a non-tab context - ie a popup view
    // chrome.tabs.getCurrent(function(tab) { 
    // });
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach(getTabStub);

    });
}