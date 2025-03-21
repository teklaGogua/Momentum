// Variables
const token = "9e6e9521-9106-40d0-9d21-9c04c3b5398f";
const dialog = document.querySelector("dialog");
const form = document.querySelector(".modal-form");
const uploadBox = document.getElementById("custom-upload");
const fileInput = document.getElementById("profile-pic");
const uploadContant = document.querySelector(
  ".modal-form-row-col-imgBoX-upload"
);
const avatarBox = document.querySelector(".modal-form-row-col-imgBoX-avatar");
const avatarImg = document.querySelector(
  ".modal-form-row-col-imgBoX-avatar-img"
);
const deleteImg = document.querySelector(
  ".modal-form-row-col-imgBoX-avatar-delete"
);
const cancelBtns = document.querySelectorAll(".cancel");
const employeeBtns = document.querySelectorAll(".employee");
const modalOverlay = document.querySelector(".modal-overlay");
const addEmployeeFiltration = document.querySelector(
  ".add-employee-filtration"
);
const addEmployeeBtn = document.getElementById("addEmployee");
const departmentsModal = document.getElementById("department");
const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const nameMinChar = document.querySelector("#name-modal-box .min-char");
const nameMaxChar = document.querySelector("#name-modal-box .max-char");
const surnameMinChar = document.querySelector("#surname-modal-box .min-char");
const surnameMaxChar = document.querySelector("#surname-modal-box .max-char");
let avatar;

// Open modal
function openModal() {
  dialog.showModal();
  modalOverlay.classList.add("active");
}

employeeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    openModal();
  });
});

// Close dialog on cancel
cancelBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.close();
    modalOverlay.classList.remove("active");
    form.reset();
    uploadContant.classList.add("active-flex");
    avatarBox.classList.remove("active");
    fileInput.disabled = false;
    avatarImg.src = "";
    avatar = null;
    nameMaxChar.classList.add("disabled");
    nameMinChar.classList.add("disabled");
    surnameMaxChar.classList.add("disabled");
    surnameMinChar.classList.add("disabled");
  });
});

// Close when clicking outside of the dialog
dialog.addEventListener("click", (e) => {
  const dialogDimensions = dialog.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    dialog.close();
    modalOverlay.classList.remove("active");
    form.reset();
    uploadContant.classList.add("active-flex");
    avatarBox.classList.remove("active");
    fileInput.disabled = false;
    avatarImg.src = "";
    avatar = null;
    nameMaxChar.classList.add("disabled");
    nameMinChar.classList.add("disabled");
    surnameMaxChar.classList.add("disabled");
    surnameMinChar.classList.add("disabled");
  }
});

// When div is clicked, trigger file input click
uploadBox.addEventListener("click", function (e) {
  e.stopPropagation();
  fileInput.click();
});

// Show a preview of the selected image
fileInput.addEventListener("change", function (event) {
  event.stopPropagation();
  avatar = event.target.files[0];
  if (avatar) {
    if (avatar.size > 600 * 1024) {
      alert("ფაილი უნდა იყოს მაქსიმუმ 600KB!");
      fileInput.value = "";
      return;
    }

    uploadContant.classList.remove("active-flex");
    avatarBox.classList.add("active");
    fileInput.disabled = true;

    const reader = new FileReader();
    reader.onload = function (e) {
      avatarImg.src = e.target.result;
    };
    reader.readAsDataURL(avatar);
  }
});

// Delete selected Img
deleteImg.addEventListener("click", (e) => {
  e.stopPropagation();
  uploadContant.classList.add("active-flex");
  avatarBox.classList.remove("active");
  fileInput.disabled = false;
});

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

    let departmentModalHTML = `<option value="" selected disabled></option>`;
    data.forEach((department) => {
      departmentModalHTML += `<option value="${department.id}">${department.name}</option>`;
    });
    departmentsModal.innerHTML = departmentModalHTML;
  } catch (error) {
    console.log("Error: ", error);
  }
}
fetchDepartments();

// Validate name field
function validateName() {
  const value = nameInput.value.trim();
  if (value.length < 2) {
    nameMinChar.classList.add("disabled");
  } else {
    nameMinChar.classList.remove("disabled");
  }
  if (value.length < 255 && value.length > 0) {
    nameMaxChar.classList.remove("disabled");
  } else {
    nameMaxChar.classList.add("disabled");
  }
}

// Validate surname field
function validateSurname() {
  const value = surnameInput.value.trim();
  if (value.length < 2) {
    surnameMinChar.classList.add("disabled");
  } else {
    surnameMinChar.classList.remove("disabled");
  }
  if (value.length < 255 && value.length > 0) {
    surnameMaxChar.classList.remove("disabled");
  } else {
    surnameMaxChar.classList.add("disabled");
  }
}

nameInput.addEventListener("input", validateName);
surnameInput.addEventListener("input", validateSurname);

// POST employee data
async function addEmployees() {
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const department_id = document.getElementById("department").value;

  // Validate name and surname before submitting
  if (name.length < 2 || name.length > 255) {
    alert("სახელი 2-დან 225 სიმბოლომდე უნდა იყოს");
    return;
  }
  if (surname.length < 2 || surname.length > 255) {
    alert("გვარი 2-დან 225 სიმბოლომდე უნდა იყოს");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("surname", surname);
  formData.append("avatar", avatar);
  formData.append("department_id", department_id);

  if (!name || !surname || !department_id || !avatar) {
    return;
  }

  try {
    const res = await fetch(
      "https://momentum.redberryinternship.ge/api/employees ",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    dialog.close();
    modalOverlay.classList.remove("active");

    form.reset();
    uploadContant.classList.add("active-flex");
    avatarBox.classList.remove("active");
    fileInput.disabled = false;
    avatarImg.src = "";
    avatar = null;
    nameMaxChar.classList.add("disabled");
    nameMinChar.classList.add("disabled");
    surnameMaxChar.classList.add("disabled");
    surnameMinChar.classList.add("disabled");

    window.location.reload();
  } catch (error) {
    console.log("Error: ", error);
  }
}

addEmployeeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addEmployees();
});
