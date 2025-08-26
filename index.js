// --------------------------- Variables ---------------------------

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalForm = document.querySelector(".modal-form");
const modalCloseButton = document.querySelector(".modal-close-button");
const addJobBtn = document.querySelector(".add-job");

let jobsArray = [];

// --------------------------- Functions ---------------------------

// Fetch jobs from Render API
async function getJobDetails() {
  try {
    let res = await fetch("http://localhost:3000/jobs");
    if (!res.ok) throw new Error("Network response was not ok");

    let data = await res.json();
    jobsArray = data; // Already an array from the API
    console.log(jobsArray);

    const jobContainer = document.querySelector(".job-card-container");
    if (jobContainer) renderJobDetails(jobsArray);

    const showMoreButton = document.getElementById("showmore-button");
    if (showMoreButton) showMoreButtonFunction(jobsArray);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    const jobContainer = document.querySelector(".job-card-container");
    if (jobContainer) {
      let span = document.createElement("span");
      span.textContent = `Failed to load jobs.`;
      span.style.textAlign = "center";
      jobContainer.appendChild(span);
    }
  }
}

// Add a new job to Render API
async function addJobToServer(jobObject) {
  try {
    let res = await fetch("http://localhost:3000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobObject),
    });

    if (!res.ok) throw new Error("Failed to add job");

    let data = await res.json();
    jobsArray.push(data); // Add the new job to the local array

    const jobContainer = document.querySelector(".job-card-container");
    if (jobContainer) renderJobDetails(jobsArray);

    console.log("Job added successfully:", data);
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
            <div class="company-info">
              <h2>${job.company.name}</h2>
              ${job.company.description}
            </div>
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
            <span >Manage Job</span>
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
  let buttondiv = document.createElement("div");
  buttondiv.style.display = "flex";
  buttondiv.style.gap = "10px";
  span.innerHTML = message;
  let div = document.createElement("div");
  div.classList.add("modal-content-box");
  div.appendChild(span);

  buttons.forEach((btn) => {
    let button = document.createElement("button");

    button.textContent = btn.text;
    button.onclick = btn.onClick;
    buttondiv.appendChild(button);
  });

  modalContent.appendChild(div);
  div.appendChild(buttondiv);
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
    modalContent.innerHTML = ""; // clear old modal content
    modalForm.classList.remove("active");

    let jobObject = {
      id: editingJobId ? editingJobId : Date.now().toString(),
      title: document.getElementById("job-title").value.trim(),
      type: document.getElementById("job-type").value.trim(),
      description: document.getElementById("job-description").value.trim(),
      salary:
        "$" + document.getElementById("job-salary").value.trim() + "/year",
      location: document.getElementById("job-location").value.trim(),
      company: {
        name: document.getElementById("Company-name").value.trim(),
        description: document
          .getElementById("Company-description")
          .value.trim(),
      },
    };

    if (editingJobId) {
      // EDIT MODE
      addModalContent("Do you want to update this job?", [
        { text: "Go Back", onClick: () => modalClose() },
        {
          text: "Update Job",
          onClick: async () => {
            try {
              let res = await fetch(
                `http://localhost:3000/jobs/${editingJobId}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(jobObject),
                }
              );
              if (!res.ok) throw new Error("Failed to update job");

              let updatedJob = await res.json();
              // update local array
              jobsArray = jobsArray.map((j) =>
                j.id === editingJobId ? updatedJob : j
              );

              localStorage.setItem("selectedJob", JSON.stringify(updatedJob));
              renderSelectedJob(updatedJob);
              editingJobId = null; // reset
              modalClose();
            } catch (err) {
              console.error("Update failed:", err);
            }
          },
        },
      ]);
    } else {
      // ADD MODE
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
    }

    modalContent.style.display = "block"; // show modal content
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
let editingJobId = null; // track if we are editing or adding

if (job) {
  renderSelectedJob(job);

  setTimeout(() => {
    const editJobButton = document.querySelector(".edit-job-button");
    const deleteJobButton = document.querySelector(".delete-job-button");

    if (editJobButton) {
      editJobButton.addEventListener("click", () => {
        modalOpen();
        modalForm.classList.add("active");
        modalContent.style.display = "none";

        editingJobId = job.id; // ✅ global var now

        document.getElementById("Company-name").value = job.company.name;
        document.getElementById("Company-description").value =
          job.company.description;
        document.getElementById("job-title").value = job.title;
        document.getElementById("job-type").value = job.type;
        document.getElementById("job-description").value = job.description;
        document.getElementById("job-salary").value = job.salary
          .replace(/\$|\/year/g, "")
          .trim();
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
          {
            text: "Delete Job",
            onClick: async () => {
              const jobIndex = jobsArray.findIndex((j) => j.id === job.id);

              if (jobIndex !== -1) {
                // Remove from local array
                jobsArray.splice(jobIndex, 1);

                // Remove from server
                try {
                  await fetch(`http://localhost:3000/jobs/${job.id}`, {
                    method: "DELETE",
                  });
                  console.log("Job deleted successfully");

                  // Remove from localStorage
                  localStorage.removeItem("selectedJob");

                  // Option 1: redirect to index page
                  window.location.href = "../index.html";
                } catch (err) {
                  console.error("Failed to delete job:", err);
                }
              }

              modalClose();
            },
          },
        ]);
      });
    }
  }, 0);
}
