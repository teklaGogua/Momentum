// Variables
const taskPriority = document.getElementById("taskPriority");
const taskStatus = document.getElementById("taskStatus");
const taskDepartment = document.getElementById("taskDepartment");
const taskEmployee = document.getElementById("taskEmployee");
const employeeLabel = document.getElementById("employee-label");
const addTaskBtn = document.getElementById("add-task-btn");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDeadline = document.getElementById("taskDeadline");
const taskTitleMinChar = taskTitle.parentElement.querySelector(".min-char");
const taskTitleMaxChar = taskTitle.parentElement.querySelector(".max-char");
const taskDescriptionMinChar =
  taskDescription.parentElement.querySelector(".min-char");
const taskDescriptionMaxChar =
  taskDescription.parentElement.querySelector(".max-char");

// Function to validate task title
function validateTaskTitle() {
  const value = taskTitle.value.trim();
  if (value.length < 3) {
    taskTitleMinChar.classList.add("disabled");
  } else {
    taskTitleMinChar.classList.remove("disabled");
  }
  if (value.length < 255 && value.length > 0) {
    taskTitleMaxChar.classList.remove("disabled");
  } else {
    taskTitleMaxChar.classList.add("disabled");
  }
}

// Function to validate task description
function validateTaskDescription() {
  const value = taskDescription.value.trim();
  if (value.length === 0) {
    taskDescriptionMinChar.classList.add("disabled");
    taskDescriptionMaxChar.classList.add("disabled");
    return;
  }
  const wordCount = value.split(/\s+/).filter((word) => word.length > 0).length;
  if (wordCount < 4) {
    taskDescriptionMinChar.classList.add("disabled");
  } else {
    taskDescriptionMinChar.classList.remove("disabled");
  }
  if (value.length < 255) {
    taskDescriptionMaxChar.classList.remove("disabled");
  } else {
    taskDescriptionMaxChar.classList.add("disabled");
  }
}

// Event listeners for task title validation
taskTitle.addEventListener("input", () => {
  validateTaskTitle();
  saveFormData();
});

// Event listeners for task description validation
taskDescription.addEventListener("input", () => {
  validateTaskDescription();
  saveFormData();
});

// Save form data to localStorage
function saveFormData() {
  const formData = {
    taskTitle: taskTitle.value,
    taskDescription: taskDescription.value,
    taskDeadline: taskDeadline.value,
    taskPriority: taskPriority.value || 2,
    taskStatus: taskStatus.value || 1,
    taskDepartment: taskDepartment.value,
    taskEmployee: taskEmployee.value,
  };
  localStorage.setItem("formData", JSON.stringify(formData));
}

// Load form data from localStorage
function loadFormData() {
  const formData = JSON.parse(localStorage.getItem("formData"));
  if (formData) {
    taskTitle.value = formData.taskTitle;
    taskDescription.value = formData.taskDescription;
    taskDeadline.value = formData.taskDeadline;
    taskPriority.value = formData.taskPriority || 2;
    taskStatus.value = formData.taskStatus || 1;
    taskDepartment.value = formData.taskDepartment;
    taskEmployee.value = formData.taskEmployee;

    validateTaskTitle();
    validateTaskDescription();

    if (formData.taskDepartment) {
      fetchEmployees();
    }
  }
}

// Clear form data from localStorage
function clearFormData() {
  localStorage.removeItem("formData");
}

// Event listeners for form inputs
taskTitle.addEventListener("input", saveFormData);
taskDescription.addEventListener("input", saveFormData);
taskDeadline.addEventListener("change", saveFormData);
taskPriority.addEventListener("change", saveFormData);
taskStatus.addEventListener("change", saveFormData);
taskDepartment.addEventListener("change", saveFormData);
taskEmployee.addEventListener("change", saveFormData);
window.addEventListener("load", loadFormData);

// Get Priorities
async function fetchPriorities() {
  try {
    const res = await fetch(
      `https://momentum.redberryinternship.ge/api/priorities`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const priorities = await res.json();
    let priorityHTML = "";
    const formData = JSON.parse(localStorage.getItem("formData"));
    const savedPriority = formData?.taskPriority || 2;
    priorities.forEach((priority) => {
      if (priority.id === parseInt(savedPriority)) {
        priorityHTML += `<option value="${priority.id}" selected>${priority.name}</option>`;
      } else {
        priorityHTML += `<option value="${priority.id}">${priority.name}</option>`;
      }
    });

    taskPriority.innerHTML = priorityHTML;
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchPriorities();

// Get statuses
async function fetchStatuses() {
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
    let statusHTML = "";
    const formData = JSON.parse(localStorage.getItem("formData"));
    const savedStatus = formData?.taskStatus || 1;
    statuses.forEach((status) => {
      if (status.id === parseInt(parseInt(savedStatus))) {
        statusHTML += `<option value="${status.id}" selected>${status.name}</option>`;
      } else {
        statusHTML += `<option value="${status.id}">${status.name}</option>`;
      }
    });

    taskStatus.innerHTML = statusHTML;
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchStatuses();

// Get Departments
async function fetchDepartments() {
  try {
    const res = await fetch(
      `https://momentum.redberryinternship.ge/api/departments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const departments = await res.json();
    const formData = JSON.parse(localStorage.getItem("formData"));
    let departmentHTML = "";
    const savedDepartment = formData?.taskDepartment || "";

    if (!savedDepartment) {
      departmentHTML = `<option value="" disabled selected>აირჩიეთ დეპარტამენტი</option>`;
    }

    departments.forEach((department) => {
      if (department.id === parseInt(savedDepartment)) {
        departmentHTML += `<option value="${department.id}" selected>${department.name}</option>`;
      } else {
        departmentHTML += `<option value="${department.id}">${department.name}</option>`;
      }
    });

    taskDepartment.innerHTML = departmentHTML;
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchDepartments();

// Get Employees
async function fetchEmployees() {
  const formData = JSON.parse(localStorage.getItem("formData"));
  const savedDepartment = formData?.taskDepartment;
  const savedEmployee = formData?.taskEmployee;

  if (savedDepartment) {
    try {
      const res = await fetch(
        `https://momentum.redberryinternship.ge/api/employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const employees = await res.json();
      taskEmployee.disabled = false;
      employeeLabel.classList.remove("disabled");
      let employeeHTML = `<option value="" disabled selected>აირჩიეთ თანამშრომელი</option>`;
      employees.forEach((employee) => {
        if (employee.department.id === parseInt(savedDepartment)) {
          if (employee.id === parseInt(savedEmployee)) {
            employeeHTML += `<option value="${employee.id}" selected>${employee.name} ${employee.surname}</option>`;
          } else {
            employeeHTML += `<option value="${employee.id}">${employee.name} ${employee.surname}</option>`;
          }
        }
      });

      taskEmployee.innerHTML = employeeHTML;
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
taskDepartment.addEventListener("change", () => {
  fetchEmployees();
});

// POST task
async function addTask() {
  const name = taskTitle.value;
  const description = taskDescription.value;
  const deadline = taskDeadline.value;
  const taskStatusValue = taskStatus.value;
  const taskEmployeeValue = taskEmployee.value;
  const taskPriorityValue = taskPriority.value;

  if (
    !name ||
    !deadline ||
    !taskStatusValue ||
    !taskEmployeeValue ||
    !taskPriorityValue
  ) {
    return;
  }

  if (name.length < 3 || name.length > 255) {
    alert("სათაური 3-დან 225 სიმბოლომდე უნდა იყოს");
    return;
  }

  if (description.length > 0) {
    const wordCount = description
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    if (wordCount < 4 || description.length > 255) {
      alert("აღწერა 4-დან 225 სიმბოლომდე უნდა იყოს");
      return;
    }
  }

  const data = {
    name: name,
    description: description,
    due_date: deadline,
    status_id: taskStatusValue,
    employee_id: taskEmployeeValue,
    priority_id: taskPriorityValue,
  };

  try {
    const res = await fetch(
      "https://momentum.redberryinternship.ge/api/tasks",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    clearFormData();
    window.location.href = `../`;
  } catch (error) {
    console.log("Error: ", error);
  }
}

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});
