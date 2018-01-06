document.addEventListener("DOMContentLoaded", () => {
  
  document.querySelector(".navbar-burger").addEventListener("click", e => {
    document.getElementById(e.target.getAttribute("data-target")).classList.toggle("is-active");
    e.target.classList.toggle("is-active");
  });

  const feedContainer = document.getElementById("feeds");

  /** @type {HTMLTemplateElement} */
  const template = document.getElementById("feed");

  chrome.storage.local.get({entries: []}, (results => {
    /** @type {Entry[]} */
    let entries = results.entries;
    for (let i = 0; i < entries.length; i++) {

      let entry = entries[i];
      if (entry.read) continue;

      let element = document.importNode(template.content, true);
      element.firstElementChild.id = entry.date;
      
      /** @type {HTMLImageElement} */
      let imageElement = document.createElement("img");

      if (entry.image) imageElement.src = entry.image.url;
      else imageElement.src = "https://www.google.com/s2/favicons?domain=" + entry.link;
      imageElement.width = 16;
      imageElement.height = 16;
      element.querySelector(".feed-author").appendChild(imageElement);
      
      let authorElement = document.createElement("span");
      authorElement.innerText = entry.author;
      element.querySelector(".feed-author").appendChild(authorElement);
      
      element.querySelector(".feed-date").innerText = entry.date;
      
      element.querySelector(".feed-title").innerText = entry.title;
      element.querySelector(".feed-title").addEventListener("click", () => {
        entries[i].read = true;
        chrome.storage.local.set({ entries: entries });
        chrome.tabs.create({url: entry.link});
      });

      element.querySelector(".delete").addEventListener("click", () => {
        entries[i].read = true;
        document.getElementById(entry.date).remove();
        chrome.storage.local.set({entries: entries});
      });

      feedContainer.appendChild(element);
    }
  }));

  document.getElementById("openSettings").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});