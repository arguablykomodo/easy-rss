import { Feed } from "./parsers";

const link = document.createElement("a");
const feedLinks = document.querySelectorAll(
  'link[type="application/rss+xml"], link[type="application/atom+xml"]'
);

const newFeeds: Feed[] = [];
for (const f of feedLinks) {
  link.href = f.getAttribute("href")!;
  newFeeds.push({
    name: f.getAttribute("title")!,
    url: link.href
  });
}

const prompt =
  "Add the following feeds?\n" + newFeeds.map(f => f.name).join("\n");

if (newFeeds.length === 0) alert("Sorry, no feeds were found");
else if (confirm(prompt)) {
  (async () => {
    const feeds: Feed[] = (await browser.storage.sync.get({ feeds: [] })).feeds;

    // Remove duplicates
    let i = feeds.length;
    while (i--) {
      if (newFeeds.some(f => f.url === feeds[i].url)) {
        feeds.splice(i, 1);
      }
    }

    browser.storage.sync.set({
      feeds: feeds.concat(newFeeds) as any
    });
  })();
}
