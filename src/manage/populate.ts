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

    const name = el.querySelector(".name") as HTMLInputElement;
    name.value = feed.name;
    name.addEventListener("change", () => {
      feeds[i].name = name.value;
      browser.storage.sync.set({ feeds: feeds as any });
    });

    const url = el.querySelector(".url") as HTMLInputElement;
    url.value = feed.url;
    url.addEventListener("change", () => {
      feeds[i].url = url.value;
      browser.storage.sync.set({ feeds: feeds as any });
    });

    el.querySelector(".delete")!.addEventListener("click", () => {
      feeds.splice(i, 1);
      browser.storage.sync.set({ feeds: feeds as any });
    });

    feedsEl.appendChild(el);
  });
}

export { populateFeeds };
