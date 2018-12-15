import { Entry, Feed, fetchEntries } from "../parsers";
import "./popup.scss";

const entryTemplate = document.getElementById("entry") as HTMLTemplateElement;
const entriesEl = document.getElementById("entries")!;
const dropdown = document.getElementById("dropdown")!;
document
  .getElementById("openDropdown")!
  .addEventListener("click", () => dropdown.classList.toggle("open"));

browser.storage.sync.set({
  feeds: [
    {
      id: "yt:channel:UCJO31lXn1Uo924ha6nO8XlA",
      name: "Dolan Darkest",
      read: [],
      url:
        "https://www.youtube.com/feeds/videos.xml?channel_id=UC6nSFpj9HTCZ5t-N3Rm3-HA"
    }
  ]
});

browser.storage.sync.get("feeds").then(async storage => {
  const toFetch = [];
  // I love typescript
  for (const feed of (storage.feeds as unknown) as Feed[]) {
    toFetch.push(fetchEntries(feed));
  }

  // I really love typescript
  const entries = ([] as Entry[]).concat(...(await Promise.all(toFetch)));
  entries.sort((a, b) => b.date.getTime() - a.date.getTime());

  for (const entry of entries) {
    const el = document.importNode(entryTemplate.content, true);
    el.querySelector(".entry")!.setAttribute("href", entry.link);
    el.querySelector(".icon")!.setAttribute("src", entry.icon);
    el.querySelector(".title")!.textContent = entry.title;
    el.querySelector(".author")!.textContent = entry.author;
    el.querySelector(".date")!.textContent = entry.date.toLocaleDateString();
    if (entry.thumbnail) {
      (el.querySelector(".image") as HTMLImageElement).src = entry.thumbnail;
    }
    entriesEl.appendChild(el);
  }
});
