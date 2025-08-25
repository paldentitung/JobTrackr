// --------------------------- Variables ---------------------------

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalForm = document.querySelector(".modal-form");
const modalCloseButton = document.querySelector(".modal-close-button");
const addJobBtn = document.querySelector(".add-job");

let jobsArray = [];

// --------------------------- Functions ---------------------------

// Fetch jobs from server
async function getJobDetails() {
  try {
    let res = await fetch("http://localhost:3000/jobs");
    if (!res.ok) throw new Error("Network response was not ok");

    let data = await res.json();
    jobsArray = data;
    console.log(jobsArray);

    // Render only if container exists
    const jobContainer = document.querySelector(".job-card-container");
    if (jobContainer) renderJobDetails(jobsArray);

    const showMoreButton = document.getElementById("showmore-button");
    if (showMoreButton) showMoreButtonFunction(jobsArray);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    const jobContainer = document.querySelector(".job-card-container");
    if (jobContainer) {
      let span = document.createElement("span");
      span.textContent = `There is no server open for details`;
      span.style.textAlign = "center";
      jobContainer.appendChild(span);
    }
  }
}

// Add job to server
async function addJobToServer(jobObject) {
  try {
    let res = await fetch("http://localhost:3000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobObject),
    });

    let data = await res.json();
    jobsArray.push(data);

    const jobContainer = document.querySelector(".job-card-container");
    if (jobContainer) renderJobDetails(jobsArray);
  } catch (error) {
    console.error("Failed to add job:", error);
  }
}

// Render job list (index page)
function renderJobDetails(data) {
  let cartContainerHtml = "";
  data.forEach((job) => {
    cartContainerHtml += `
      <div class="card">
        <div class="job-type">${job.type}</div>
        <div class="job-title">${job.title}</div>
        <div class="job-description">${job.description}</div>
        <div class="job-details">
          <div class="job-salary">$${job.salary}/year</div>
          <div class="job-location-box">
            location: <span class="job-location">${job.location}</span>
          </div>
        </div>
        <button class="read-more-btn">Read More</button>
      </div>
    `;
  });

  const jobContainer = document.querySelector(".job-card-container");
  if (jobContainer) jobContainer.innerHTML = cartContainerHtml;

  // Shorten descriptions
  const descriptions = document.querySelectorAll(".job-description");
  descriptions.forEach((desc) => {
    const fullText = desc.textContent;
    const shortText = fullText.slice(0, 110) + " ... ";
    desc.textContent = shortText;

    desc.addEventListener("click", () => {
      desc.textContent = desc.textContent === fullText ? shortText : fullText;
    });
  });

  readMoreButtonFunction(data);
}

// Handle Read More buttons
function readMoreButtonFunction(data) {
  const readMoreButtons = document.querySelectorAll(".read-more-btn");
  readMoreButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const job = data[index];
      localStorage.setItem("selectedJob", JSON.stringify(job));
      window.location.href = "../pages/job.html";
    });
  });
}

// Show More functionality
function showMoreButtonFunction(data) {
  const showMoreButton = document.getElementById("showmore-button");
  if (!showMoreButton) return;

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

// Render selected job (job.html)
function renderSelectedJob(job) {
  const container = document.querySelector(".container");
  if (!container || !job) return;

  const containerHtml = `
    <div class="card-container">
      <div class="job-card">
        <div class="card-row">
          <div class="job-type">${job.type}</div>
          <div class="job-title">${job.title}</div>
          <div class="job-location-box">
            Location: <span class="job-location">${job.location}</span>
          </div>
        </div>
        <div class="card-row">
          <h3>Job Description</h3>
          <div class="job-description">${job.description}</div>
          <h3>Salary</h3>
          <div class="job-salary">$${job.salary}/year</div>
        </div>
      </div>
      <div class="job-modify">
        <h2>Manage Job</h2>
        <div class="job-btn-container">
          <button class="edit-job-button btn">Edit Job</button>
          <button class="delete-job-button btn">Delete Job</button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = containerHtml;
}

// Add modal content
function addModalContent(message, buttons) {
  if (!modalContent) return;

  let span = document.createElement("span");
  span.innerHTML = message;
  let div = document.createElement("div");
  div.classList.add("modal-content-box");
  div.appendChild(span);

  buttons.forEach((btn) => {
    let button = document.createElement("button");
    button.textContent = btn.text;
    button.onclick = btn.onClick;
    div.appendChild(button);
  });

  modalContent.appendChild(div);
}

function modalClose() {
  if (modal) modal.classList.remove("active");
}
function modalOpen() {
  if (modal) modal.classList.add("active");
}

// --------------------------- Event Listeners ---------------------------
window.addEventListener("load", () => {
  getJobDetails();

  // Render selected job on job.html
  const job = JSON.parse(localStorage.getItem("selectedJob"));
  if (job) renderSelectedJob(job);
});

if (modalForm) {
  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (modalForm) modalForm.classList.remove("active");

    if (modalContent) {
      modalContent.innerHTML = ""; // clear previous content
    }

    let jobObject = {
      title: document.getElementById("job-title").value.trim(),
      type: document.getElementById("job-type").value.trim(),
      description: document.getElementById("job-description").value.trim(),
      salary: document.getElementById("job-salary").value + "/year",
      location: document.getElementById("job-location").value.trim(),
    };

    addModalContent("Do you want to add this job?", [
      { text: "Go Back", onClick: () => modalClose() },
      {
        text: "Add Job",
        onClick: async () => {
          await addJobToServer(jobObject);
          modalClose();
        },
      },
    ]);

    if (modalContent) modalContent.style.display = "block"; // show modal content
  });
}

if (modalCloseButton) {
  modalCloseButton.addEventListener("click", modalClose);
}
if (addJobBtn) {
  addJobBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (modal) modal.classList.add("active");
    if (modalForm) modalForm.classList.add("active");
    if (modalContent) modalContent.style.display = "none"; // hide content while form is open
  });
}
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modalClose();
  });
}

const job = JSON.parse(localStorage.getItem("selectedJob"));

if (job) {
  renderSelectedJob(job);

  setTimeout(() => {
    const editJobButton = document.querySelector(".edit-job-button");
    const deleteJobButton = document.querySelector(".delete-job-button");

    if (editJobButton) {
      editJobButton.addEventListener("click", () => {
        console.log("clicked edit");
        modalOpen();
        modalForm.classList.add("active");
        modalContent.style.display = "none";
        document.getElementById("job-title").value = job.title;
        document.getElementById("job-type").value = job.type;
        document.getElementById("job-description").value = job.description;
        let rawSalary = job.salary; // "$40-50k/year"
        let cleanSalary = rawSalary.replace(/\$|\/year/g, "");
        // cleanSalary = "40-50k"
        document.getElementById("job-salary").value = cleanSalary;

        document.getElementById("job-location").value = job.location;
      });
    }

    if (deleteJobButton) {
      deleteJobButton.addEventListener("click", () => {
        console.log("clicked delete");

        // Open modal
        modalOpen();
        modalContent.style.display = "block";
        modalForm.style.display = "none";

        // Clear previous content
        modalContent.innerHTML = "";

        // Add delete confirmation
        addModalContent("Are you sure you want to delete this job?", [
          { text: "Cancel", onClick: () => modalClose() },
          {
            text: "Delete Job",
            onClick: async () => {
              const jobIndex = jobsArray.findIndex(
                (j) => j.title === job.title && j.type === job.type
              );

              if (jobIndex !== -1) {
                jobsArray.splice(jobIndex, 1);

                // Update server (DELETE request)
                try {
                  await fetch(`http://localhost:3000/jobs/${job.id}`, {
                    method: "DELETE",
                  });
                  renderJobDetails(jobsArray);
                } catch (err) {
                  console.error("Failed to delete job:", err);
                }
              }

              modalClose();
              renderSelectedJob();
            },
          },
        ]);
      });
    }
  }, 0);
}
