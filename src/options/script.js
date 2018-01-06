const { xml2js } = require("xml-js");
document.addEventListener("DOMContentLoaded", () => {
  const intervalInput = document.querySelector("#interval input");
  const intervalOutput = document.querySelector("#interval .control:last-child a");
  intervalInput.addEventListener("input", e => {
    intervalOutput.innerHTML = e.target.value + " minutes";
    chrome.storage.local.set({interval: parseInt(e.target.value, 10)});
  });

  chrome.storage.local.get({interval: 5}, results => {
    intervalInput.value = results.interval;
    intervalOutput.innerHTML = results.interval + " minutes";
  });
  
  document.getElementById("importFile").addEventListener("change", e => {
    let reader = new FileReader();
    reader.addEventListener("load", e => {
      /** @type {XML} */
      let opml = xml2js(e.target.result);
  
      /** @type {(Feed|Folder)[]} */
      let parsedFeeds = [];
      opml.elements[0].elements[1].elements.forEach(feed => parsedFeeds.push(parseFeed(feed)));
  
      chrome.storage.local.set({ feeds: parsedFeeds });
    });
    reader.readAsText(e.target.files[0]);
  });

  /**
   * @param {Feed|Folder} feed 
   */
  function parseEntries(feed) {
    let element = document.importNode(template.content, true);
    if (feed.type === "feed") {
      element.firstElementChild.classList.add("feed");
      element.querySelector(".fa").classList.add("fa-feed");
      element.querySelector("a").innerHTML += feed.name;
    }
    else {
      element.firstElementChild.classList.add("folder");
      element.querySelector(".fa").classList.add("fa-folder");
      element.querySelector("a").innerHTML += feed.name;
      element.querySelector("a").innerHTML += "<ul></ul>";
      for (let child of feed.feeds) {
        element.querySelector("ul").appendChild(parseEntries(child));
      }
    }
    return element;
  }

  /** @type {HTMLTemplateElement} */
  const template = document.getElementById("feedTemplate");
  const entries = document.getElementById("entries");
  chrome.storage.local.get({feeds: []}, results => {
    /** @type {(Feed|Folder)[]} */
    let feeds = results.feeds;
    for (let item of feeds) {
      entries.appendChild(parseEntries(item));
    }
  });
});

/** @param {XMLItem} feed */
function parseFeed(feed) {
  /** @type {Feed|Folder} */
  let element = {};
  if (feed.attributes.xmlUrl) {
    element.type = "feed";
    element.name = feed.attributes.title;
    element.url = feed.attributes.xmlUrl;
  }
  else {
    element.type = "folder";
    element.name = feed.attributes.title;
    element.feeds = [];
    feed.elements.forEach(child => element.feeds.push(parseFeed(child)));
  }
  return element;
}