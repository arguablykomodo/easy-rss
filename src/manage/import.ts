const input = document.getElementById("upload") as HTMLInputElement;

async function importFeeds(): Promise<void> {
	if (!(input.files && input.files[0])) return;
	const file = input.files[0];
	const reader = new FileReader();
	reader.onload = async () => {
		const src = reader.result as string;
		const parser = new DOMParser();
		const xml = parser.parseFromString(src, "application/xml");
		const feeds: Feed[] = [];
		for (const node of xml.querySelectorAll("outline[xmlUrl]")) {
			feeds.push({
				name: node.getAttribute("title")!,
				url: node.getAttribute("xmlUrl")!
			});
		}
		const oldFeeds: Feed[] = (await browser.storage.sync.get({ feeds: [] }))
			.feeds;

		// Remove duplicates
		let i = oldFeeds.length;
		while (i--)
			if (feeds.some(f => f.url === oldFeeds[i].url)) oldFeeds.splice(i, 1);

		browser.storage.sync.set({ feeds: oldFeeds.concat(feeds) as unknown as StorageValue });
		location.reload();
	};
	reader.readAsText(file);
}

export { importFeeds };
