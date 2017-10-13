chrome.storage.sync.get({"interval": 5}, items => {
  chrome.alarms.create("RSSFetch", {periodInMinutes: items.interval});
  chrome.alarms.onAlarm.addListener(fetchFeeds);
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.interval) {
    chrome.alarms.clear("RSSFetch");
    chrome.alarms.create("RSSFetch", {periodInMinutes: changes.interval.newValue });
    chrome.alarms.onAlarm.addListener(fetchFeeds);
  }
});

function fetchFeeds(alarm) {
  console.log("I'm supposed to fetch the RSS feeds now!");
}