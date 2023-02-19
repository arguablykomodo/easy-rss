const link = document.getElementById("download") as HTMLAnchorElement;

function escapeXml(input: string): string {
	return input
		.replace("&", "&amp;")
		.replace("\"", "&quot;")
		.replace("'", "&apos;")
		.replace("<", "&lt;")
		.replace(">", "&gt;");
}

async function exportFeeds(): Promise<void> {
	const feeds: Feed[] = (await browser.storage.sync.get({ feeds: [] })).feeds;

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
  <body>
    ${feeds
		.map(f => `<outline title="${escapeXml(f.name)}" xmlUrl="${escapeXml(f.url)}" />`)
		.join("\n    ")}
  </body>
</opml>`;
	const blob = new Blob([xml], { type: "text/xml" });

	link.href = URL.createObjectURL(blob);
	link.click();
	URL.revokeObjectURL(link.href);
}

export { exportFeeds };
