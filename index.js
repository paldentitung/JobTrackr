const menuBtn = document.querySelector(".menu-button");
menuBtn.addEventListener("click", () => {
  let nav = document.querySelector("nav");

  nav.classList.toggle("active");

  menuBtn.innerHTML = nav.classList.contains("active")
    ? '<i class="fas fa-times" ></i>'
    : '  <i class="fas fa-bars" id="menu-icon"></i>';
});

async function getJobDetails() {
  try {
    let res = await fetch(
      "https://raw.githubusercontent.com/paldentitung/JobTrackr/refs/heads/main/db.json"
    );
    let data = await res.json();

    // Use the jobs array
    const jobsArray = data.jobs;

    renderJobDetails(jobsArray);
    showMoreButtonFunction(jobsArray);
  } catch (error) {
    alert("error is " + error);
  }
}

function renderJobDetails(data) {
  let cartContainerHtml = "";
  data.forEach((job) => {
    cartContainerHtml += `
          <div class="card">
            <div class="job-type">${job.type}</div>
            <div class="job-title">${job.title}</div>
            <div class="job-description">
          ${job.description}
            </div>
            <div class="job-details">
              <div class="job-salary">$${job.salary}/year</div>
              <div class="job-location-box">
                loaction: <span class="job-loaction">${job.location}</span>
              </div>
            </div>
            <button class="read-more-btn">Read More</button>
          </div>
  `;
  });
  document.querySelector(".job-card-container").innerHTML = cartContainerHtml;
  let description = document.querySelectorAll(".job-description");

  description.forEach((description) => {
    let fullText = description.textContent;
    let shortText = fullText.slice(0, 110) + "  ... ";

    description.textContent = shortText;

    description.addEventListener("click", () => {
      if (description.textContent === fullText) {
        description.textContent = shortText;
      } else {
        description.textContent = fullText;
      }
    });
  });
}

function showMoreButtonFunction(data) {
  let showMoreButton = document.getElementById("showmore-button");
  let count = 3;
  let showAll = false;

  renderJobDetails(data.slice(0, count));
  showMoreButton.addEventListener("click", () => {
    if (!showAll) {
      count = data.length;
      renderJobDetails(data.slice(onabort, count));
      showMoreButton.textContent = "show less";
      showAll = true;
    } else {
      count = 3;
      renderJobDetails(data.slice(0, count));
      showAll = false;
    }
  });
}
getJobDetails();

// faq

const faqbox = document.querySelectorAll(".faq-item");

faqbox.forEach((question) => {
  question.addEventListener("click", () => {
    let ans = question.querySelector(".faq-answer");
    ans.classList.toggle("active");
  });
});
