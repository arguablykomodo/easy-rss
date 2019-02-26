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

const domainRegex = /[/?#]/;

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
  let domain = feed.url;
  if (feed.url.startsWith("http://")) domain = domain.slice(7);
  if (feed.url.startsWith("https://")) domain = domain.slice(8);
  entry.icon =
    "http://www.google.com/s2/favicons?domain=" + domain.split(domainRegex)[0];

  // Get thumbnail
  const thumbnail = el.getElementsByTagName("media:thumbnail")[0];
  if (thumbnail) entry.thumbnail = thumbnail.getAttribute("url");

  return entry as Entry;
}

const parser = new DOMParser();

async function fetchEntries(feed: Feed) {
  const src = await (await fetch(feed.url)).text();
  const xml = parser.parseFromString(src, "application/xml");
  const entries: Entry[] = [];
  for (const el of xml.querySelectorAll("entry, item"))
    entries.push(parse(el, feed));
  return entries;
}

export { fetchEntries };
