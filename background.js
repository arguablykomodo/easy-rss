chrome.storage.sync.get({"interval": 5}, items => {
  chrome.alarms.create("RSSFetch", {periodInMinutes: items.interval});
});

chrome.alarms.onAlarm.addListener(alarm => {
  console.log("I'm supposed to fetch the RSS feeds now!");
});