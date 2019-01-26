const feedTemplate = document.getElementById("feed") as HTMLTemplateElement;
const feedsEl = document.getElementById("feeds")!;

async function populateFeeds(feeds: Feed[]) {
  feedsEl.innerHTML = "";

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
    });
    feedsEl.appendChild(el);
  });
}

export { populateFeeds };
