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
  }

  if (formData.taskDepartment) {
    fetchEmployees();
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
    priorities.forEach((priority) => {
      if (priority.id === parseInt(formData.taskPriority)) {
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
    statuses.forEach((status) => {
      if (status.id === parseInt(formData.taskStatus)) {
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
    let selected = true;
    let departmentHTML = "";
    if (formData.taskDepartment === "") {
      departmentHTML = `<option value="" disabled selected>აირჩიეთ სტატუსი</option>`;
    } else {
      selected = false;
    }
    departments.forEach((department) => {
      if (!selected && department.id === parseInt(formData.taskDepartment)) {
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
  if (formData.taskDepartment) {
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
        if (employee.department.id === parseInt(formData.taskDepartment)) {
          employeeHTML += `<option value="${employee.id}">${employee.name} ${employee.surname}</option>`;
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
    !description ||
    !deadline ||
    !taskStatusValue ||
    !taskEmployeeValue ||
    !taskPriorityValue
  ) {
    return;
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
    window.location.href = `/`;
  } catch (error) {
    console.log("Error: ", error);
  }
}

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});
