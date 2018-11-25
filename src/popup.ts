import "./popup.scss";

const dropdown = document.getElementById("dropdown")!;
document
  .getElementById("openDropdown")!
  .addEventListener("click", () => dropdown.classList.toggle("open"));
