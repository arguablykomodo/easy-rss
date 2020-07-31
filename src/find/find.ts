import dialog from "./find.pug";
import "./find.scss";

const feedLinks: NodeListOf<HTMLLinkElement> = document.querySelectorAll(
	"link[type=\"application/rss+xml\"], link[type=\"application/atom+xml\"]"
);

const feeds: Feed[] = [];
for (const f of feedLinks) {
	feeds.push({
		name: f.title,
		url: f.href
	});
}

const html = dialog({
	css: browser.runtime.getURL("find/find.css"),
	feeds
});

const div = document.createElement("div");
(div.style as { all: string }).all = "initial";
const shadow = div.attachShadow({ mode: "open" });
// This is safe because it goes through a template engine (pugjs) that makes sure everything is sanitized
shadow.innerHTML = html;
document.body.appendChild(div);

shadow.getElementById("exit")!.addEventListener("click", () => div.remove());
shadow.getElementById("add")!.addEventListener("click", async () => {
	const newFeeds: Feed[] = [];
	for (const feed of shadow.querySelectorAll("#feeds div")) {
		const checked = feed.querySelector(".enabled") as HTMLInputElement;
		if (checked.checked) {
			const name = feed.querySelector(".name") as HTMLInputElement;
			const url = feed.querySelector(".url") as HTMLInputElement;
			newFeeds.push({
				name: name.value,
				url: url.value
			});
		}
	}

	const oldFeeds: Feed[] = (await browser.storage.sync.get({ feeds: [] }))
		.feeds;

	// Remove duplicates
	let i = oldFeeds.length;
	while (i--) {
		if (newFeeds.some(f => f.url === oldFeeds[i].url)) {
			oldFeeds.splice(i, 1);
		}
	}

	browser.storage.sync.set({ feeds: newFeeds.concat(oldFeeds) as unknown as StorageValue });
	div.remove();
});
