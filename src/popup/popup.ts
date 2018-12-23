import { Entry } from "../parsers";
import "./popup.scss";

const entryTemplate = document.getElementById("entry") as HTMLTemplateElement;
const entriesEl = document.getElementById("entries")!;
const dropdown = document.getElementById("dropdown")!;

document.getElementById("find")!.addEventListener("click", () => {
  browser.tabs.executeScript(undefined, { file: "/find.js" });
});

document
  .getElementById("openDropdown")!
  .addEventListener("click", () => dropdown.classList.toggle("open"));
document
  .getElementById("manage")!
  .addEventListener("click", () => browser.runtime.openOptionsPage());
document.getElementById("clear")!.addEventListener("click", async () => {
  const entries: Entry[] = (await browser.storage.sync.get({ entries: [] }))
    .entries;
  browser.storage.sync.set({ read: entries.map(e => e.id) });
  browser.browserAction.setBadgeText({ text: "" });
  location.reload();
});

browser.storage.sync.get({ entries: [], read: [] }).then(results => {
  const { entries, read }: { entries: Entry[]; read: string[] } = results;

  if (entries.length === 0 || entries.length === read.length) {
    const text = document.createElement("div");
    text.className = "no_entries";
    text.textContent = "You are all caught up!";
    entriesEl.appendChild(text);
  }

  let i = 0;
  for (const entry of entries) {
    if (i > 100) break;
    if (read.indexOf(entry.id) !== -1) continue;

    const el = document.importNode(entryTemplate.content, true);
    const entryEl = el.querySelector(".entry")!;

    el.querySelector(".icon")!.setAttribute("src", entry.icon);
    el.querySelector(".title")!.textContent = entry.title;
    el.querySelector(".author")!.textContent = entry.author;
    el.querySelector(".date")!.textContent = new Date(
      entry.date
    ).toLocaleDateString();

    if (entry.thumbnail) {
      const image = document.createElement("img");
      image.className = "image";
      image.src = entry.thumbnail;
      entryEl.appendChild(image);
    }

    entryEl.addEventListener("click", async e => {
      entryEl.remove();
      read.push(entry.id);
      browser.storage.sync.set({ read });
      browser.browserAction.setBadgeText({
        text: (
          parseInt(await browser.browserAction.getBadgeText({}), 10) - 1
        ).toString()
      });
      if ((e.target as HTMLImageElement).className !== "read")
        browser.tabs.create({ url: entry.link });
    });

    entriesEl.appendChild(el);
    i++;
  }
});
