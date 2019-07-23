import { populateEntries } from "./populate";
import "./popup.scss";

// Find feeds in page
document.getElementById("find")!.addEventListener("click", () => {
  browser.tabs.executeScript(undefined, { file: "/find/find.js" });
  browser.tabs.insertCSS(undefined, { file: "/find/find.css" });
});

// Add new feed
const add = document.getElementById("add") as HTMLDivElement;
add.addEventListener("click", e => {
  add.textContent = "URL: ";
  const input = document.createElement("input");
  input.type = "url";
  input.addEventListener("change", async () => {
    const feeds: Feed[] = (await browser.storage.sync.get({ feeds: [] })).feeds;
    feeds.unshift({ url: input.value, name: "" });
    browser.storage.sync.set({ feeds: feeds as any });
    add.innerHTML = "Add new feed";
  });
  add.appendChild(input);
  input.focus();
});

// Open tools
const tools = document.getElementById("tools")!;
document
  .getElementById("openTools")!
  .addEventListener("click", () => tools.classList.toggle("open"));

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
