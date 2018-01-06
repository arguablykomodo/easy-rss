const { xml2js } = require("xml-js");
const { parsers } = require("./_parsers");

const storageGet = stuff => new Promise(resolve => chrome.storage.local.get(stuff, resolve));

/**
 * @param {Promise<Entry[]>[]} feeds
 */
async function uploadEntries(feeds) {
  /** @type {Entry[]} */
  let results = await Promise.all(feeds);

  results = results.reduce((prev, curr) => prev.concat(curr), []);
  results.sort((a, b) => b.date - a.date);

  results = results.map(entry => {
    entry.date = entry.date.toLocaleString();
    return entry;
  });

  /** @type {Entry[]} */
  let oldEntries = await storageGet({entries: []});
  oldEntries = oldEntries.entries;
  
  for (let i = oldEntries.length - 1; i > 0; i--) {
    let oldEntry = oldEntries[i];
    if (oldEntry.read) {
      results[i].read = true;
    }
  }

  chrome.storage.local.set({entries: results});
}

/**
 * @param {Feed} feed
 * @returns {Promise<Entry[]>}
 */
async function fetchEntries(feed) {

  let text = await fetch(feed.url).then(response => response.text());
  /** @type {XML} */
  let xml = xml2js(text);

  let entries = [];
  for (let parser of parsers) {
    if (text.match(parser.pattern)) {
      let xmlElement = xml;

      for (let i = 0; i < parser.bodyDepth; i++) {
        xmlElement = xmlElement.elements[0];
      }

      let author;
      let titleElement = xmlElement.elements.filter(item => item.name === "title")[0].elements;
      if (titleElement) {
        author = titleElement[0].text;
      }
      else {
        author = feed.name;
      }

      let image;
      let imageElement = xmlElement.elements.filter(item => item.name === "image")[0];
      if (imageElement) {
        image = {
          url: imageElement.elements.filter(item => item.name === "url")[0].elements[0].text,
          width: imageElement.elements.filter(item => item.name === "width")[0].elements[0].text,
          height: imageElement.elements.filter(item => item.name === "height")[0].elements[0].text
        };
      }

      entries = xmlElement.elements.filter(item => item.name === parser.entryName).map(entry => {
        /** @type {Entry} */
        let newEntry = {};
        newEntry.read = false;
        newEntry.author = author;
        if (image) {
          newEntry.image = image;
        }
        for (let child of entry.elements) {
          for(let item of parser.items) {
            if (item.name === child.name) {
              if (typeof item.text === "boolean") {
                newEntry[item.property] = child.elements[0].text;
              }
              else {
                newEntry[item.property] = child.attributes[item.text];
              }
            }
          }
        }
        newEntry.date = new Date(newEntry.date);
        return newEntry;
      });
      break;
    }
  }

  return entries;
}

exports.fetchEntries = fetchEntries;
exports.uploadEntries = uploadEntries;