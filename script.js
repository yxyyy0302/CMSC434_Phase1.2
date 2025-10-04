function openTab(tabId) {
  document
    .querySelectorAll(".tab")
    .forEach((div) => (div.style.display = "none"));
  document.getElementById(tabId).style.display = "block";
  document
    .querySelectorAll(".navbar button")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`[onclick="openTab('${tabId}')"]`)
    .classList.add("active");
}

window.onload = () => openTab("tab1");

function showChoices() {
  const radio = document.querySelector('input[name="opt"]:checked');
  const drop = document.getElementById("dropdown").value;
  if (!radio) {
    document.getElementById("choiceResult").textContent = "No choices selected";
  } else {
    if (radio.value  == "A"){
      document.getElementById("choiceResult").textContent = "Added to savings from " + drop
    } else{
      document.getElementById("choiceResult").textContent = "Subtracted from savings for " + drop

    }
  }
}

// helpers scoped to Tab 6
function createTodoItem(text) {
  const li = document.createElement("li");
  li.className = "todo6-item";

  const span = document.createElement("span");
  span.className = "todo6-text";
  span.textContent = text;

  const close = document.createElement("span");
  close.className = "close";
  close.textContent = "×";

  li.appendChild(span);
  li.appendChild(close);
  return li;
}

function addTaskFromInput() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (!value) return;

  const li = createTodoItem(value);
  document.getElementById("taskList").appendChild(li);
  input.value = "";
  input.focus();
}

function wireTodoList() {
  const list = document.getElementById("taskList");

  // Toggle "done" when clicking the item or its text
  list.addEventListener("click", (e) => {
    const li = e.target.closest(".todo6-item");
    if (!li) return;
    if (e.target.classList.contains("close")) return; // delete handled below
    li.classList.toggle("done");
  });

  // Delete when clicking ×
  list.addEventListener("click", (e) => {
    if (!e.target.classList.contains("close")) return;
    const li = e.target.closest(".todo6-item");
    if (li) li.remove();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("addBtn")
    ?.addEventListener("click", addTaskFromInput);
  document.getElementById("taskInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTaskFromInput();
  });

  wireTodoList();
});

function showWarning() {
  const box = document.getElementById("warningBox");
  box.innerHTML = `
    <div style="background:#f44336; color:white; padding:10px; border-radius:5px;">
      <strong>Warning!</strong> Do not click on the profile image.
      <span style="float:right; cursor:pointer;" onclick="this.parentElement.style.display='none'">x</span>
    </div>
  `;
  box.style.display = "block";
}