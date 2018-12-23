import { Feed } from "../parsers";
import "./manage.scss";

const interval = document.getElementById("interval") as HTMLInputElement;
const intervalOutput = document.getElementById("intervalOutput")!;
const saveSettings = document.getElementById("saveSettings")!;
const feedTemplate = document.getElementById("feed") as HTMLTemplateElement;
const feedsEl = document.getElementById("feeds")!;

const minutes = (s: string) => `${s} ${s === "1" ? "minute" : "minutes"}`;

saveSettings.addEventListener("click", () => {
  browser.storage.sync.set({ interval: parseInt(interval.value, 10) });
});

interval.addEventListener("input", () => {
  intervalOutput.textContent = minutes(interval.value);
});

browser.storage.sync.get({ interval: 5, feeds: [] }).then(results => {
  interval.value = results.interval.toString();
  intervalOutput.textContent = minutes(results.interval.toString());

  const feeds: Feed[] = results.feeds;
  if (feeds.length === 0) {
    const text = document.createElement("div");
    text.className = "no_feeds";
    text.textContent = "You have no feeds. Go find some!";
    feedsEl.appendChild(text);
  }

  feeds.forEach((feed, i) => {
    const el = document.importNode(feedTemplate.content, true);
    (el.querySelector(".name") as HTMLInputElement).value = feed.name;
    (el.querySelector(".url") as HTMLInputElement).value = feed.url;
    el.querySelector(".delete")!.addEventListener("click", () => {
      feeds.splice(i, 1);
      browser.storage.sync.set({ feeds: feeds as any });
      location.reload();
    });
    feedsEl.appendChild(el);
  });
});

document.getElementById("sync")!.addEventListener("click", async () => {
  const r = await fetch(
    "https://www.youtube.com/subscription_manager?action_takeout=1"
  );

  if (r.redirected) alert("Please login into YouTube to sync subscriptions");
  else {
    const parser = new DOMParser();
    const xml = parser.parseFromString(await r.text(), "application/xml");
    const newFeeds: Feed[] = [];
    for (const node of xml.querySelectorAll("outline > outline")) {
      newFeeds.push({
        name: node.getAttribute("title")!,
        url: node.getAttribute("xmlUrl")!
      });
    }

    const feeds: Feed[] = (await browser.storage.sync.get({ feeds: [] })).feeds;

    // Remove existing youtube subs
    let i = feeds.length;
    while (i--)
      if (feeds[i].url.startsWith("https://www.youtube.com/feeds/videos.xml"))
        feeds.splice(i, 1);

    await browser.storage.sync.set({ feeds: feeds.concat(newFeeds) as any });
    location.reload();
  }
});
