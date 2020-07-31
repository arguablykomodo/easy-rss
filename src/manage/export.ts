const link = document.getElementById("download") as HTMLAnchorElement;

async function exportFeeds(): Promise<void> {
	const feeds: Feed[] = (await browser.storage.sync.get({ feeds: [] })).feeds;

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
  <body>
    ${feeds
		.map(f => `<outline title="${f.name}" xmlUrl="${f.url}" />`)
		.join("\n    ")}
  </body>
</opml>`;
	const blob = new Blob([xml], { type: "text/xml" });

	link.href = URL.createObjectURL(blob);
	link.click();
	URL.revokeObjectURL(link.href);
}

export { exportFeeds };
