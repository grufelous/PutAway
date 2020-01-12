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