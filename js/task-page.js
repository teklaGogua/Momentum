// Variables
const token = "9e6e9521-9106-40d0-9d21-9c04c3b5398f";
const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get("id");
const title = document.getElementById("title");
const description = document.getElementById("description");
const priorityBox = document.getElementById("priority-box");
const priorityName = document.getElementById("priority-name");
const priorityImg = document.getElementById("priority-img");
const departmentBox = document.getElementById("department-box");
const departmentName = document.getElementById("department-name");
const departmentFullName = document.getElementById("department-fullName");
const dateBox = document.getElementById("date");
const avatar = document.getElementById("avatar");
const employeeName = document.getElementById("employeeName");
const status = document.getElementById("status");
let initialStatusId = null;

const departments = {
  1: ["ადმინისტრაცია", "#FB5607"],
  2: ["ად.რესურსები", "#08A508"],
  3: ["ფინანსები", "#FFD86D"],
  4: ["გაყიდ.მარკეტინგ", "#FA4D4D"],
  5: ["ლოჯისტიკა", "#3A86FF"],
  6: ["ტექნოლოგიები", "#F7BC30"],
  7: ["მედია", "#FF006E"],
};
const priorityColors = {
  1: "#08A508",
  2: "#F7BC30",
  3: "#FA4D4D",
};
const georgianDays = ["კვ", "ორშ", "სამშ", "ოთხშ", "ხუთ", "პარ", "შაბ"];

// Get statuses
async function fetchStatus(id) {
  try {
    const res = await fetch(
      `https://momentum.redberryinternship.ge/api/statuses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const statuses = await res.json();
    let departmentModalHTML = "";
    statuses.forEach((status) => {
      if (status.id === id) {
        departmentModalHTML += `<option value="${status.id}" selected>${status.name}</option>`;
      } else {
        departmentModalHTML += `<option value="${status.id}">${status.name}</option>`;
      }
    });

    status.innerHTML = departmentModalHTML;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Change status
function populateTaskDetails(id) {
  status.addEventListener("change", (e) => {
    const newStatus = parseInt(e.target.value);

    if (newStatus !== id) {
      updateTaskStatus(newStatus);
    }
  });
}

async function updateTaskStatus(newStatusId) {
  try {
    const res = await fetch(
      `https://momentum.redberryinternship.ge/api/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          status_id: newStatusId,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    initialStatusId = newStatusId;
  } catch (error) {
    console.error("Update failed:", error);
    select.value = initialStatusId;
  }
}

// Fetch data
async function fetchTaskDetails() {
  try {
    const res = await fetch(
      `https://momentum.redberryinternship.ge/api/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const task = await res.json();

    // Get department
    const department = departments[task.department.id];

    // Date Formating
    const date = new Date(task.due_date);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const dayOfWeek = georgianDays[date.getUTCDay()];

    const formattedDate = `${dayOfWeek} - ${day}/${month}/${year}`;

    //Populate page with data
    title.textContent = task.name;
    description.textContent = task.description;
    priorityBox.style.borderColor = priorityColors[task.priority.id];
    priorityName.textContent = task.priority.name;
    priorityImg.src = task.priority.icon;
    departmentBox.style.background = department[1];
    departmentName.textContent = department[0];
    departmentFullName.textContent = task.department.name;
    dateBox.textContent = formattedDate;
    employeeName.textContent = `${task.employee.name} ${task.employee.surname}`;
    avatar.src = task.employee?.avatar || "../images/error/default-pfp.png";
    avatar.onerror = function () {
      this.onerror = null;
      this.src = "../images/error/default-pfp.png";
    };
    fetchStatus(task.status.id);
    populateTaskDetails(task.status.id);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to load task details");
    window.location.href = "/";
  }
}
fetchTaskDetails();
