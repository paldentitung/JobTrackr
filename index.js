// --------------------------- Variables ---------------------------
const menuBtn = document.querySelector(".menu-button");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalForm = document.querySelector(".modal-form");
const modalCloseButton = document.querySelector(".modal-close-button");
const faqbox = document.querySelectorAll(".faq-item");

let jobsArray = [];

// --------------------------- Functions ---------------------------
async function getJobDetails() {
  try {
    let res = await fetch("http://localhost:3000/jobs");
    if (!res.ok) throw new Error("Network response was not ok");

    let data = await res.json();
    jobsArray = data;
    console.log(jobsArray);

    renderJobDetails(jobsArray);
    showMoreButtonFunction(jobsArray);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    let span = document.createElement("span");
    span.textContent = `There is no server open for details`;
    span.style.textAlign = "center";
    document.querySelector(".job-card-container").appendChild(span);
  }
}

async function addJobToServer(jobObject) {
  try {
    let res = await fetch("http://localhost:3000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobObject),
    });

    let data = await res.json();
    jobsArray.push(data);
    renderJobDetails(jobsArray);
  } catch (error) {
    console.error("Failed to add job:", error);
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
      renderJobDetails(data.slice(0, count));
      showMoreButton.textContent = "show less";
      showAll = true;
    } else {
      count = 3;
      renderJobDetails(data.slice(0, count));
      showAll = false;
    }
  });
}

function addModalContent(message, buttons) {
  let span = document.createElement("span");
  span.innerHTML = message;
  let div = document.createElement("div");
  div.classList.add("modal-content-box");
  div.appendChild(span);
  buttons.forEach((btn) => {
    let button = document.createElement("button");
    div.appendChild(button);
    button.textContent = btn.text;
    button.onclick = btn.onClick;
  });

  modalContent.appendChild(div);
}

function modalClose() {
  return modal.classList.remove("active");
}

function modalOpen() {
  return modal.classList.add("active");
}

// --------------------------- Event Listeners ---------------------------
window.onload = getJobDetails;

menuBtn.addEventListener("click", () => {
  let nav = document.querySelector("nav");

  nav.classList.toggle("active");

  menuBtn.innerHTML = nav.classList.contains("active")
    ? '<i class="fas fa-times" ></i>'
    : '  <i class="fas fa-bars" id="menu-icon"></i>';
});

document.querySelector(".add-job").addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.add("active");
  modalForm.classList.add("active");
  modalContent.style.display = "none";
});

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  modalForm.classList.remove("active");
  modalContent.innerHTML = "";

  let jobObject = {
    title: document.getElementById("job-title").value.trim(),
    type: document.getElementById("job-type").value.trim(),
    description: document.getElementById("job-description").value.trim(),
    salary: document.getElementById("job-salary").value + "/year",
    location: document.getElementById("job-location").value.trim(),
  };

  addModalContent("do you want to add this job", [
    {
      text: "Go Back",
      onClick: () => modalClose(),
    },
    {
      text: "Add Job",
      onClick: async () => {
        await addJobToServer(jobObject);
        modalClose();
      },
    },
  ]);
  modalContent.style.display = "block";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modalClose();
  }
});

modalCloseButton.addEventListener("click", () => {
  modalClose();
  console.log("clicked");
});

faqbox.forEach((question) => {
  question.addEventListener("click", () => {
    let ans = question.querySelector(".faq-answer");
    ans.classList.toggle("active");
  });
});
