const faqbox = document.querySelectorAll(".faq-item");

faqbox.forEach((question) => {
  question.addEventListener("click", () => {
    let ans = question.querySelector(".faq-answer");
    ans.classList.toggle("active");
  });
});
