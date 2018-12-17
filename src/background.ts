import { Entry, Feed, fetchEntries } from "./parsers";

browser.storage.sync.set({
  feeds: [
    {
      id: "yt:channel:UCJO31lXn1Uo924ha6nO8XlA",
      name: "Extra Credits",
      read: [],
      url:
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCCODtTcd5M1JavPCOr_Uydg"
    },
    {
      id: "factorio",
      name: "Factorio Blog",
      read: [],
      url: "https://www.factorio.com/blog/rss"
    }
  ]
});

async function fetch() {
  const storage = await browser.storage.sync.get("feeds");
  const toFetch = [];
  // I love typescript
  for (const feed of (storage.feeds as any) as Feed[]) {
    toFetch.push(fetchEntries(feed));
  }

  // I really love typescript
  const entries = ([] as Entry[]).concat(...(await Promise.all(toFetch)));
  entries.sort((a, b) => b.date.getTime() - a.date.getTime());

  // I really really love typescript
  browser.storage.local.set({ entries: entries as any });
}

browser.alarms.create("fetch", { periodInMinutes: 1 });
browser.alarms.onAlarm.addListener(fetch);
fetch();
