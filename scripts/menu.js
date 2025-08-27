const menuBtn = document.querySelector(".menu-button");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    console.log("clicked");
    let nav = document.querySelector("nav");
    console.log(nav);

    nav.classList.toggle("active");

    document.body.style.overflow = nav.classList.contains("active")
      ? "hidden"
      : "auto";

    menuBtn.innerHTML = nav.classList.contains("active")
      ? '<i class="fas fa-times" ></i>'
      : '  <i class="fas fa-bars" id="menu-icon"></i>';
  });
}
