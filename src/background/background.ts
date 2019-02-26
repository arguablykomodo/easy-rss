import { fetchEntries } from "./parser";

const sorter = (a: Entry, b: Entry) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

async function fetch() {
  const {
    feeds,
    read
  }: { feeds: Feed[]; read: string[] } = await browser.storage.sync.get({
    feeds: [],
    read: []
  });

  const toFetch: Array<Promise<Entry[]>> = [];
  for (const feed of feeds) {
    toFetch.push(fetchEntries(feed));
  }

  const entries = ([] as Entry[]).concat(...(await Promise.all(toFetch)));
  entries.sort(sorter);

  browser.storage.sync.set({ entries: entries as any, read });
}
fetch();

browser.storage.sync.get({ interval: 5 }).then(results => {
  browser.alarms.create("fetch", { periodInMinutes: results.interval });
  browser.alarms.onAlarm.addListener(fetch);
});

browser.storage.onChanged.addListener(async changes => {
  if (changes.feeds) {
    fetch();
  }

  if (changes.interval) {
    await browser.alarms.clear("fetch");
    browser.alarms.create("fetch", {
      periodInMinutes: changes.interval.newValue
    });
  }

  if (changes.read || changes.entries) {
    const read: string[] = changes.read
      ? changes.read.newValue
      : (await browser.storage.sync.get({ read: [] })).read;
    const entries: Entry[] = changes.entries
      ? changes.entries.newValue
      : (await browser.storage.sync.get({ entries: [] })).entries;

    let unread = 0;
    for (const entry of entries) if (read.indexOf(entry.id) === -1) unread++;

    browser.browserAction.setBadgeText({
      text: unread === 0 ? "" : unread.toString()
    });
  }
});
