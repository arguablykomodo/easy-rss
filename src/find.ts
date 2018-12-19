import { Feed } from "./parsers";

const link = document.createElement("a");
const feedLinks = document.querySelectorAll(
  'link[type="application/rss+xml"],link[type="application/atom+xml"]'
);

const feeds: Feed[] = [];
for (const f of feedLinks) {
  link.href = f.getAttribute("href")!;
  feeds.push({
    name: f.getAttribute("title")!,
    url: link.href
  });
}

if (feeds.length === 0) alert("Sorry, no feeds were found");
else if (
  confirm(`Add the following feeds?\n${feeds.map(f => f.name).join("\n")}`)
) {
  browser.storage.sync.get({ feeds: [] }).then(results => {
    (results.feeds as Feed[]).push(...feeds);
    browser.storage.sync.set({
      feeds: results.feeds
    });
  });
}
