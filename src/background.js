const { fetchEntries, uploadEntries } = require("./_parser");

chrome.storage.local.get({"interval": 1}, items => {
  chrome.alarms.create("RSSFetch", {periodInMinutes: items.interval});
  chrome.alarms.onAlarm.addListener(fetchFeeds);
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.interval) {
    chrome.alarms.clear("RSSFetch");
    chrome.alarms.create("RSSFetch", {periodInMinutes: changes.interval.newValue});
    chrome.alarms.onAlarm.addListener(fetchFeeds);
  }
});

function fetchFeeds() {
  chrome.storage.local.get({feeds: []}, items => {
    let promises = [];
    /** @type {(Feed|Folder)[]} */
    let feeds = items.feeds;
    for(let item of feeds) {
      promises = promises.concat(parseFeed(item));
    }
    uploadEntries(promises);
  });
}

/**
 * @param {Feed|Folder} feed
 * @returns {Promise<Entry[]>[]}
 */
function parseFeed(feed) {
  if (feed.type === "feed") {
    return [fetchEntries(feed)];
  }
  else {
    let feeds = [];
    feed.feeds.forEach(child => {
      feeds = feeds.concat(parseFeed(child));
    });
    return feeds;
  }
}