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

import atom from "./parsers/atom";
import rss from "./parsers/rss";

const parsers: Array<(src: string, feed: Feed) => undefined | Entry[]> = [
  atom,
  rss
];

async function fetchEntries(feed: Feed) {
  const src = await (await fetch(feed.url)).text();
  for (const parser of parsers) {
    const result = parser(src, feed);
    if (result) return result;
  }
  return [];
}

export { Feed, Entry, fetchEntries };
