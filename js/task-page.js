// Variables
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
const avatarPhoto = document.getElementById("avatarPhoto");
const employeeName = document.getElementById("employeeName");
const status = document.getElementById("status");
const commentsSection = document.querySelector(".comments-section");
const addComment = document.getElementById("addComment");
const submitComment = document.getElementById("submitComment");
const addTask = document.querySelector(".task");
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
    let statusModalHTML = "";
    statuses.forEach((status) => {
      if (status.id === id) {
        statusModalHTML += `<option value="${status.id}" selected>${status.name}</option>`;
      } else {
        statusModalHTML += `<option value="${status.id}">${status.name}</option>`;
      }
    });

    status.innerHTML = statusModalHTML;
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
    avatarPhoto.src =
      task.employee?.avatar || "../images/error/default-pfp.png";
    avatarPhoto.onerror = function () {
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

// Get Comments
async function fetchComments() {
  try {
    const res = await fetch(
      `https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const comments = await res.json();
    let commentsHTML = `<h3 class="comments-section-title">
                  კომენტარები <span id="comments-count">${comments.length}</span>
              </h3>`;

    comments.forEach((comment) => {
      let subCommentsHTML = "";

      if (comment.sub_comments.length !== 0) {
        subCommentsHTML = comment.sub_comments
          .map(
            (subComment) => `
          <div class="comments-section-comment reply">
            <img
              src="${subComment.author_avatar}"
              alt="User Avatar"
              class="comments-section-comment-avatar"
            />
            <div class="comments-section-comment-content">
              <p class="comments-section-comment-content-name">
                ${subComment.author_nickname}
              </p>
              <p class="comments-section-comment-content-text">
                ${subComment.text}
              </p>
            </div>
          </div>`
          )
          .join("");
      }

      commentsHTML += `
            <div class="comments-container">
              <div class="comments-section-comment">
                <img
                  src="${comment.author_avatar}"
                  alt="User Avatar"
                  class="comments-section-comment-avatar"
                />
                <div class="comments-section-comment-content">
                  <p class="comments-section-comment-content-name">
                    ${comment.author_nickname}
                  </p>
                  <p class="comments-section-comment-content-text">
                    ${comment.text}
                  </p>
                  <div class="comments-section-comment-content-reply" data-comment-id="${comment.id}">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_4157_1772)">
                        <path
                          class="comments-section-comment-content-reply-icon"
                          d="M16.0007 13.9993H14.6673V11.9993C14.6673 8.66602 12.0007 5.99935 8.66732 5.99935H5.33398V4.66602H8.66732C12.734 4.66602 16.0007 7.93268 16.0007 11.9993V13.9993Z"
                          fill="#8338EC"
                        />
                        <path
                          class="comments-section-comment-content-reply-icon"
                          d="M2 5.33333L5.33333 8.66667V2L2 5.33333Z"
                          fill="#8338EC"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4157_1772">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p class="comments-section-comment-content-reply-text">
                      პასუხი
                    </p>
                  </div>
                </div>
              </div>
              ${subCommentsHTML}
            </div>
            `;
    });
    commentsSection.innerHTML = commentsHTML;
    const replyButtons = document.querySelectorAll(
      ".comments-section-comment-content-reply"
    );
    replyButtons.forEach((btn) =>
      btn.addEventListener("click", handleReplyClick)
    );
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchComments();

// Post comments
async function postComments() {
  const commentText = addComment.value;
  console.log(commentText);

  if (commentText) {
    try {
      const res = await fetch(
        `https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            text: commentText,
          }),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
submitComment.addEventListener("click", (e) => {
  e.preventDefault();
  postComments();
});

// Handle sub-comments
function handleReplyClick(e) {
  const replyBtn = e.currentTarget;
  const commentId = replyBtn.dataset.commentId;
  const commentContent = replyBtn.closest(".comments-section-comment-content");

  document.querySelectorAll(".reply-form").forEach((form) => form.remove());
  const form = document.createElement("div");
  form.className = "reply-form";

  form.innerHTML = `
    <div class="comments-add comments-subcomments">
      <textarea class="comments-add-input" placeholder="დაამატე პასუხი"></textarea>
      <button class="comments-add-submit reply-submit">პასუხის გაგზავნა</button>
    </div>
      `;

  commentContent.appendChild(form);

  form.querySelector(".reply-submit").addEventListener("click", async (e) => {
    e.preventDefault();
    const text = form.querySelector("textarea").value.trim();
    if (text) {
      try {
        await fetch(
          `https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: text,
              parent_id: commentId,
            }),
          }
        );
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });
}

// Open Add task page
addTask.addEventListener("click", () => {
  window.location.href = `task-add.html`;
});
