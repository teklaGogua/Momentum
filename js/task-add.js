// Vaariables
const taskPriority = document.getElementById("taskPriority");
const taskStatus = document.getElementById("taskStatus");
const taskDepartment = document.getElementById("taskDepartment");
const taskEmployee = document.getElementById("taskEmployee");
const employeeLabel = document.getElementById("employee-label");
const addTaskBtn = document.getElementById("add-task-btn");

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
    let priorityHTML = `<option value="" disabled selected>აირჩიეთ პრიორიტეტი</option>`;
    priorities.forEach((priority) => {
      priorityHTML += `<option value="${priority.id}">${priority.name}</option>`;
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
    let statusHTML = `<option value="" disabled selected>აირჩიეთ სტატუსი</option>`;
    statuses.forEach((status) => {
      statusHTML += `<option value="${status.id}">${status.name}</option>`;
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
    let departmentHTML = `<option value="" disabled selected>აირჩიეთ სტატუსი</option>`;
    departments.forEach((department) => {
      departmentHTML += `<option value="${department.id}">${department.name}</option>`;
    });

    taskDepartment.innerHTML = departmentHTML;
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchDepartments();

// Get Employees
async function fetchEmployees() {
  if (taskDepartment.value) {
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
        if (employee.department.id === parseInt(taskDepartment.value)) {
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
  const name = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const taskDeadline = document.getElementById("taskDeadline").value;
  const taskPriorityValue = taskPriority.value;
  const taskStatusValue = taskStatus.value;
  const taskEmployeeValue = taskEmployee.value;

  const data = {
    name: name,
    description: description,
    due_date: taskDeadline,
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

    window.location.href = `/`;
  } catch (error) {
    console.log("Error: ", error);
  }
}

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});
