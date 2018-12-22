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
  for (const feed of feeds) {
    const el = document.importNode(feedTemplate.content, true);
    (el.querySelector(".name") as HTMLInputElement).value = feed.name;
    (el.querySelector(".url") as HTMLInputElement).value = feed.url;
    feedsEl.appendChild(el);
  }
});
