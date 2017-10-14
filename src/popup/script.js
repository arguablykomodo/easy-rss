document.addEventListener("DOMContentLoaded", () => {
  
  document.querySelector(".navbar-burger").addEventListener("click", e => {
    document.getElementById(e.target.getAttribute("data-target")).classList.toggle("is-active");
    e.target.classList.toggle("is-active");
  });

  const feedContainer = document.getElementById("feeds");
  /** @type {HTMLTemplateElement} */
  const template = document.getElementById("feed");
  for (let i = 0; i < 10; i++) {
    let now = new Date();
    template.content.querySelector(".feed-img").src = "http://placekitten.com/200/300";
    template.content.querySelector(".feed-author").innerText = "Lorem Ipsum";
    template.content.querySelector(".feed-date").innerText = `${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.toTimeString().split(" ")[0]}`;
    template.content.querySelector(".feed-title").innerText = "Dolores sit amet, placeholder stuff yada yada yada";

    feedContainer.appendChild(document.importNode(template.content, true));
  }
});