import { populateEntries } from "./populate";
import "./popup.scss";

const dropdown = document.getElementById("dropdown")!;

// Find feeds in page
document.getElementById("find")!.addEventListener("click", () => {
  browser.tabs.executeScript(undefined, { file: "/find/find.js" });
  browser.tabs.insertCSS(undefined, { file: "/find/find.css" });
});

// Open dropdown
document
  .getElementById("openDropdown")!
  .addEventListener("click", () => dropdown.classList.toggle("open"));

// Open settings
document
  .getElementById("manage")!
  .addEventListener("click", () => browser.runtime.openOptionsPage());

// Mark all as read
document.getElementById("clear")!.addEventListener("click", async () => {
  const {
    entries,
    read
  }: { entries: Entry[]; read: string[] } = await browser.storage.sync.get({
    entries: [],
    read: []
  });

  for (const entry of entries)
    if (read.indexOf(entry.id) === -1) read.push(entry.id);
  browser.storage.sync.set({ read });
});

populateEntries();
browser.storage.onChanged.addListener(changes => {
  if (changes.read || changes.entries) {
    populateEntries();
  }
});
