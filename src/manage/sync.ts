async function sync() {
  const r = await fetch(
    "https://www.youtube.com/subscription_manager?action_takeout=1"
  );

  if (r.redirected) alert("Please login into YouTube to sync subscriptions");
  else {
    const parser = new DOMParser();
    const xml = parser.parseFromString(await r.text(), "application/xml");
    const newFeeds: Feed[] = [];
    for (const node of xml.querySelectorAll("outline > outline")) {
      newFeeds.push({
        name: node.getAttribute("title")!,
        url: node.getAttribute("xmlUrl")!
      });
    }

    const feeds: Feed[] = (await browser.storage.sync.get({ feeds: [] })).feeds;

    // Remove existing youtube subs
    let i = feeds.length;
    while (i--)
      if (feeds[i].url.startsWith("https://www.youtube.com/feeds/videos.xml"))
        feeds.splice(i, 1);

    browser.storage.sync.set({ feeds: feeds.concat(newFeeds) as any });
  }
}

export { sync };
