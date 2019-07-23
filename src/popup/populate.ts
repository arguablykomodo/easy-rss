const entryTemplate = document.getElementById("entry") as HTMLTemplateElement;
const entriesEl = document.getElementById("entries")!;

async function populateEntries() {
  const {
    entries,
    read
  }: { entries: Entry[]; read: string[] } = await browser.storage.sync.get({
    entries: [],
    read: []
  });

  entriesEl.innerHTML = "";

  let unread = 0;
  for (const entry of entries) if (read.indexOf(entry.id) === -1) unread++;
  if (unread === 0) {
    const text = document.createElement("div");
    text.className = "empty";
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
      (el.querySelector(".thumbnail") as HTMLImageElement).src =
        entry.thumbnail;
    }

    entryEl.addEventListener("click", async e => {
      read.push(entry.id);
      browser.storage.sync.set({ read });

      // Only open new tab if user didn't click the "mark as read" button
      if ((e.target as Element).className !== "read")
        browser.tabs.create({ url: entry.link });
    });

    entriesEl.appendChild(el);
    i++;
  }
}

export { populateEntries };
