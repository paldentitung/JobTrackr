const menuBtn = document.querySelector(".menu-button");
menuBtn.addEventListener("click", () => {
  let nav = document.querySelector("nav");

  nav.classList.toggle("active");

  menuBtn.innerHTML = nav.classList.contains("active")
    ? '<i class="fas fa-times" ></i>'
    : '  <i class="fas fa-bars" id="menu-icon"></i>';
});
