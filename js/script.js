// Variables
const filtrationBtns = document.querySelectorAll(".filtration-el-btn");
let previouslyClickedBtn = null;
const checkBox = document.querySelectorAll(".filtration-el-dropdown-options");
const departmentsContainer = document.getElementById("departments-container");
const employeesContainer = document.getElementById("employees-container");

const georgianMonths = [
  "იან",
  "თებ",
  "მარ",
  "აპრ",
  "მაი",
  "ივნ",
  "ივლ",
  "აგვ",
  "სექ",
  "ოქტ",
  "ნოე",
  "დეკ",
];
const priorityColors = {
  1: "#08A508",
  2: "#F7BC30",
  3: "#FA4D4D",
};
const status = {
  1: "starter",
  2: "inProgress",
  3: "testing",
  4: "finished",
};
const departments = {
  1: ["ადმინისტრაცია", "#FB5607"],
  2: ["ად.რესურსები", "#08A508"],
  3: ["ფინანსები", "#FFD86D"],
  4: ["გაყიდ.მარკეტინგ", "#FA4D4D"],
  5: ["ლოჯისტიკა", "#3A86FF"],
  6: ["ტექნოლოგიები", "#F7BC30"],
  7: ["მედია", "#FF006E"],
};

// Get all departments
async function fetchDepartments() {
  try {
    const res = await fetch(
      "https://momentum.redberryinternship.ge/api/departments ",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    let departmentHTML = "";
    data.forEach((department) => {
      // Get colors
      const color = departments[department.id][1];

      departmentHTML += `<div class="filtration-el-dropdown-options-el">
                <div class="icon-for-marking">
                  <svg
                    class="filtration-el-dropdown-options-el-checked"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.75"
                      y="0.75"
                      width="20.5"
                      height="20.5"
                      rx="5.25"
                      stroke="${color}"
                      stroke-width="1.5"
                    />
                    <path
                      d="M16.3334 7.33325L9.00008 14.6666L5.66675 11.3333"
                      stroke="${color}"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg
                    class="filtration-el-dropdown-options-el-empty active"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.75"
                      y="0.75"
                      width="20.5"
                      height="20.5"
                      rx="5.25"
                      stroke="${color}"
                      stroke-width="1.5"
                    />
                  </svg>
                </div>
                <p class="filtration-el-dropdown-options-el-text">${department.name}</p>
              </div>`;
    });
    departmentsContainer.innerHTML = departmentHTML;
  } catch (error) {
    console.log("Error: ", error);
  }
}
fetchDepartments();

// Get all employees
async function fetchEmployees() {
  try {
    const res = await fetch(
      "https://momentum.redberryinternship.ge/api/employees ",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    let employeeHTML = `<div class="filtration-el-dropdown-options-el add-employee-filtration" onclick="openModal()">
                  <svg 
                  class="active" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect class="add-img-stroke" x="0.75" y="0.75" width="16.5" height="16.5" rx="8.25" stroke="#8338EC" stroke-width="1.5"/>
                  <path class="add-img-fill" d="M9.576 8.456H13.176V9.656H9.576V13.304H8.256V9.656H4.656V8.456H8.256V4.808H9.576V8.456Z" fill="#8338EC"/>
                  </svg>
                <p class="filtration-el-dropdown-options-el-text add-text">დაამატე თანამშრომელი</p>
              </div>`;

    data.forEach((employee) => {
      employeeHTML += `<div class="filtration-el-dropdown-options-el">
                <div class="icon-for-marking">
                  <svg
                    class="filtration-el-dropdown-options-el-checked"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.75"
                      y="0.75"
                      width="20.5"
                      height="20.5"
                      rx="5.25"
                      stroke="#8338EC"
                      stroke-width="1.5"
                    />
                    <path
                      d="M16.3334 7.33325L9.00008 14.6666L5.66675 11.3333"
                      stroke="#8338EC"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg
                    class="filtration-el-dropdown-options-el-empty active"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.75"
                      y="0.75"
                      width="20.5"
                      height="20.5"
                      rx="5.25"
                      stroke="#8338EC"
                      stroke-width="1.5"
                    />
                  </svg>
                </div>
                <img
                  src="${employee.avatar}"
                  alt="user"
                  class="filtration-el-dropdown-options-el-img"
                />
                <p class="filtration-el-dropdown-options-el-text">${employee.name} ${employee.surname}</p>
              </div>`;
    });
    employeesContainer.innerHTML = employeeHTML;
  } catch (error) {
    console.log("Error: ", error);
  }
}
fetchEmployees();

// Filtration buttons' functionality
filtrationBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dropdownId = btn.getAttribute("data-dropdown");
    const dropdown = document.getElementById(`${dropdownId}-dropdown`);
    const arrowUp = btn.querySelector(".arrow-up");
    const arrowDown = btn.querySelector(".arrow-down");
    const text = btn.querySelector("p");

    dropdown.classList.toggle("active");
    arrowUp.classList.toggle("active");
    arrowDown.classList.toggle("active");
    text.style.color =
      text.style.color === "rgb(131, 56, 236)"
        ? "rgb(33, 37, 41)"
        : "rgb(131, 56, 236)";

    if (previouslyClickedBtn && previouslyClickedBtn !== btn) {
      const prevDropdownId = previouslyClickedBtn.getAttribute("data-dropdown");
      const prevDropdown = document.getElementById(
        `${prevDropdownId}-dropdown`
      );
      const prevArrowUp = previouslyClickedBtn.querySelector(".arrow-up");
      const prevArrowDown = previouslyClickedBtn.querySelector(".arrow-down");
      const prevText = previouslyClickedBtn.querySelector("p");

      prevDropdown.classList.remove("active");
      prevArrowUp.classList.remove("active");
      prevArrowDown.classList.add("active");
      prevText.style.color = "rgb(33, 37, 41)";
    }
    previouslyClickedBtn = btn;
  });
});

// Checkbox functionality
function checkboxFunc() {
  checkBox.forEach((box) => {
    box.addEventListener("click", (e) => {
      const btn = e.target.closest(".icon-for-marking");
      if (!btn) return;

      const emptyBtn = btn.querySelector(
        ".filtration-el-dropdown-options-el-empty"
      );
      const markedBtn = btn.querySelector(
        ".filtration-el-dropdown-options-el-checked"
      );

      emptyBtn.classList.toggle("active");
      markedBtn.classList.toggle("active");
    });
  });
}
checkboxFunc();

// Get all tasks
async function fetchData() {
  try {
    const res = await fetch(
      "https://momentum.redberryinternship.ge/api/tasks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    let taskHTML = "";
    const statusHTML = {};
    data.forEach((task) => {
      // Status
      const statusId = status[task.status.id];

      // Priority Colors
      const borderColor = priorityColors[task.priority.id];

      // department
      const department = departments[task.department.id][0];
      const departmentColor = departments[task.department.id][1];

      // Date Formating
      const date = new Date(task.due_date);

      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1;
      const year = date.getUTCFullYear();

      const monthName = georgianMonths[month];
      const formattedDate = `${day} ${monthName}, ${year}`;

      // Description
      let description = "";
      if (task.description.length <= 100) {
        description = task.description;
      } else {
        description = task.description.substring(0, 100) + "...";
      }

      taskHTML = `<div class="tasks-el-box-card" onclick="openTask(${task.id})">
              <div class="tasks-el-box-card-header">
                <div class="tasks-el-box-card-header-tags">
                  <div class="tasks-el-box-card-header-tags-priority"  style="border-color: ${borderColor} !important;">
                    <img src="${task.priority.icon}" alt="priority icon" />
                    <p style="color: ${borderColor} !important;">${
        task.priority.name
      }</p>
                  </div>
                  <div class="tasks-el-box-card-header-tags-department" style="background-color: ${departmentColor}">
                    <p>${department}</p>
                  </div>
                </div>
                <p class="tasks-el-box-card-header-data">${formattedDate}</p>
              </div>
              <div class="tasks-el-box-text">
                <h4 class="tasks-el-box-text-title">
                  ${task.name}
                </h4>
                <p class="tasks-el-box-text-description">
                  ${description}
                </p>
              </div>
              <div class="tasks-el-box-info">
                <img src="${
                  task.employee?.avatar || "images/error/default-pfp.png"
                }" alt="avatar" 
                onerror="this.onerror=null;this.src='./images/error/default-pfp.png';"/>
                <div class="tasks-el-box-info-comments">
                  <img src="images/icons/comments.svg" alt="Comments" />
                  <p>${task.total_comments}</p>
                </div>
              </div>
              </div>
              `;

      if (!statusHTML[statusId]) statusHTML[statusId] = [];
      statusHTML[statusId].push(taskHTML);
    });

    Object.keys(statusHTML).forEach((statusId) => {
      const container = document.getElementById(statusId);
      if (container) {
        container.innerHTML = statusHTML[statusId].join("");
      }
    });
  } catch (error) {
    console.error("Error: ", error);
  }
}
fetchData();

// Open card page
function openTask(taskId) {
  window.location.href = `/pages/task-page.html?id=${taskId}`;
}
