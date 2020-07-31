import { fetchEntries } from "./parser";

browser.storage.sync.get(["entries", "read"]).then(({ entries, read }) => {
	if (entries) {
		console.log("migrating entry data to local storage...");
		browser.storage.local.set({ entries });
		browser.storage.sync.remove("entries");
	}
	if (read) {
		console.log("migrating read data to local storage...");
		browser.storage.local.set({ read });
		browser.storage.sync.remove("read");
	}
});

const sorter = (a: Entry, b: Entry) =>
	new Date(b.date).getTime() - new Date(a.date).getTime();

async function fetch() {
	browser.browserAction.setBadgeBackgroundColor({ color: "#3b88c3" });
	browser.browserAction.setBadgeText({ text: "🕒" });
	const feeds: Feed[] = (await browser.storage.sync.get({ feeds: [] })).feeds;

	const toFetch: Array<Promise<Entry[]>> = [];
	for (const feed of feeds) {
		toFetch.push(fetchEntries(feed));
	}

	const entries = ([] as Entry[]).concat(...(await Promise.all(toFetch)));
	entries.sort(sorter);

	browser.storage.local.set({ entries: entries as unknown as StorageValue });
}
fetch();

browser.storage.sync.get({ interval: 5 }).then(results => {
	browser.alarms.create("fetch", { periodInMinutes: results.interval });
	browser.alarms.onAlarm.addListener(fetch);
});

browser.storage.onChanged.addListener(async (changes, areaName) => {
	if (changes.feeds) {
		fetch();
	}

	if (changes.interval) {
		await browser.alarms.clear("fetch");
		browser.alarms.create("fetch", {
			periodInMinutes: changes.interval.newValue
		});
	}

	if ((changes.read || changes.entries) && areaName === "local") {
		const read: string[] = changes.read && changes.read.newValue
			? changes.read.newValue
			: (await browser.storage.local.get({ read: [] })).read;
		const entries: Entry[] = changes.entries && changes.entries.newValue
			? changes.entries.newValue
			: (await browser.storage.local.get({ entries: [] })).entries;

		let unread = 0;
		for (const entry of entries) if (read.indexOf(entry.id) === -1) unread++;

		browser.browserAction.setBadgeBackgroundColor({ color: "#dd2e44" });
		browser.browserAction.setBadgeText({
			text: unread === 0 ? "" : unread.toString()
		});
	}
});
