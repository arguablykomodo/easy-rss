import { Entry, Feed } from "../defs";

interface Option {
  selector: string;
  attribute?: string;
}

const attributes: { [x: string]: Option[] } = {
  author: [{ selector: "author name" }, { selector: "author" }],
  date: [
    { selector: "published" },
    { selector: "updated" },
    { selector: "pubDate" }
  ],
  id: [{ selector: "id" }, { selector: "guid" }],
  link: [{ selector: "link", attribute: "href" }, { selector: "link" }],
  title: [{ selector: "title" }]
};

function parse(el: Element, feed: Feed) {
  const entry: any = {};

  for (const attribute in attributes) {
    const options = attributes[attribute];
    for (const option of options) {
      if (entry[attribute]) continue;
      const element = el.querySelector(option.selector);
      if (element) {
        if (option.attribute)
          entry[attribute] = element.getAttribute(option.attribute)!;
        else entry[attribute] = element.textContent!;
      }
    }
    if (!entry[attribute]) entry[attribute] = "";
  }

  // Get icon
  entry.icon =
    "http://www.google.com/s2/favicons?domain=" +
    feed.url
      .replace("http://", "")
      .replace("https://", "")
      .split(/[/?#]/)[0];

  // Get thumbnail
  const results = /<media:thumbnail.+url="(.+?)".*\/>/.exec(el.innerHTML);
  if (results) entry.thumbnail = results[1];

  return entry as Entry;
}

async function fetchEntries(feed: Feed) {
  const src = await (await fetch(feed.url)).text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(src, "application/xml");
  const entries: Entry[] = [];
  for (const el of xml.querySelectorAll("entry, item"))
    entries.push(parse(el, feed));
  return entries;
}

export { fetchEntries };
