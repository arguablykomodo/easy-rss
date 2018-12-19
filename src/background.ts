import { Entry, Feed, fetchEntries } from "./parsers";

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
  entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Remove old read entries
  let i = read.length;
  while (i--) {
    if (!entries.some(entry => entry.id === read[i])) {
      read.splice(i, 1);
    }
  }

  let unread = 0;
  for (const entry of entries) {
    if (read.indexOf(entry.id) === -1) {
      unread++;
    }
  }
  if (unread !== 0)
    browser.browserAction.setBadgeText({ text: unread.toString() });

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
  } else if (changes.interval) {
    await browser.alarms.clear("fetch");
    browser.alarms.create("fetch", {
      periodInMinutes: changes.interval.newValue
    });
  }
});
