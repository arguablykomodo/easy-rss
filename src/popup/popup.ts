import { Entry, Feed, fetchEntries } from "../parsers";
import "./popup.scss";

const entryTemplate = document.getElementById("entry") as HTMLTemplateElement;
const entriesEl = document.getElementById("entries")!;
const dropdown = document.getElementById("dropdown")!;
document
  .getElementById("openDropdown")!
  .addEventListener("click", () => dropdown.classList.toggle("open"));

browser.storage.local.get("entries").then(async entries => {
  for (const entry of (entries.entries as any) as Entry[]) {
    const el = document.importNode(entryTemplate.content, true);
    el.querySelector(".entry")!.setAttribute("href", entry.link);
    el.querySelector(".icon")!.setAttribute("src", entry.icon);
    el.querySelector(".title")!.textContent = entry.title;
    el.querySelector(".author")!.textContent = entry.author;
    el.querySelector(".date")!.textContent = entry.date.toLocaleDateString();
    if (entry.thumbnail) {
      const image = document.createElement("img");
      image.className = "image";
      image.src = entry.thumbnail;
      el.querySelector(".entry")!.appendChild(image);
    }
    entriesEl.appendChild(el);
  }
});
