import { getDomain } from "./utils";

interface Feed {
  name: string;
  url: string;
}

interface Entry {
  id: string;
  title: string;
  link: string;
  date: string;
  icon: string;
  author: string;
  thumbnail?: string;
}

interface Option {
  selector: string;
  attribute?: string;
}

interface Parser {
  author: Option[];
  date: Option[];
  id: Option[];
  link: Option[];
  title: Option[];
}

const attributes: Parser = {
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

type Prop = "id" | "title" | "link" | "date" | "author";

function parse(el: Element, feed: Feed) {
  const entry: any = {};

  for (const prop of ["id", "title", "link", "date", "author"] as Prop[]) {
    const options = attributes[prop] as Option[];
    for (const option of options) {
      if (entry[prop]) continue;
      const element = el.querySelector(option.selector);
      if (element) {
        if (option.attribute) {
          entry[prop] = element.getAttribute(option.attribute)!;
        } else {
          entry[prop] = element.textContent!;
        }
      }
    }
    if (!entry[prop]) entry[prop] = "";
  }

  entry.icon =
    "http://www.google.com/s2/favicons?domain=" + getDomain(feed.url);

  const results = /<media:thumbnail.+url="(.+?)".*\/>/.exec(el.innerHTML);
  if (results) entry.thumbnail = results[1];

  return (entry as any) as Entry;
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

export { Feed, Entry, fetchEntries };
