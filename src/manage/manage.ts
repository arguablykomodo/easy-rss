import { Feed } from "../parsers";
import "./manage.scss";

const interval = document.getElementById("interval") as HTMLInputElement;
const intervalOutput = document.getElementById("intervalOutput")!;
const saveSettings = document.getElementById("saveSettings")!;
const feedTemplate = document.getElementById("feed") as HTMLTemplateElement;
const feedsEl = document.getElementById("feeds")!;

saveSettings.addEventListener("click", () => {
  browser.storage.sync.set({ interval: parseInt(interval.value, 10) });
});

interval.addEventListener("input", () => {
  intervalOutput.textContent = `${interval.value} ${
    interval.value === "1" ? "minute" : "minutes"
  }`;
});

browser.storage.sync.get({ interval: 5, feeds: [] }).then(results => {
  interval.value = results.interval.toString();
  intervalOutput.textContent = `${results.interval} ${
    results.interval === 1 ? "minute" : "minutes"
  }`;

  const feeds: Feed[] = results.feeds;
  for (const feed of feeds) {
    const el = document.importNode(feedTemplate.content, true);
    (el.querySelector(".name") as HTMLInputElement).value = feed.name;
    (el.querySelector(".url") as HTMLInputElement).value = feed.url;
    feedsEl.appendChild(el);
  }
});
