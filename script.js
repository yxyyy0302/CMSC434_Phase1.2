/*SCREEN NAVIGATION*/
let currentScreen = 'screen-home'; // Keep track of the active screen
let navButtons;

function showScreen(screenId) {
  // Hide the old screen
  document.getElementById(currentScreen).classList.remove('active');
  
  // Show the new screen
  const newScreen = document.getElementById(screenId);
  newScreen.classList.add('active');
  
  // Update navbar button styles
  navButtons.forEach(btn => {
    if (btn.getAttribute('onclick') === `showScreen('${screenId}')`) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  currentScreen = screenId;
}

/*APP STARTUP & DATA*/
document.addEventListener("DOMContentLoaded", () => {
  navButtons = document.querySelectorAll(".navbar button");
  
  initializeApp(); // Set up default data if needed
  loadAppData();   // Load all data from localStorage
  
  // Show the home screen by default
  showScreen('screen-home');

  wireTransactionList();
});

// Sets up the app with default data if it's the first time
function initializeApp() {
  if (localStorage.getItem("balance") === null) {
    localStorage.setItem("balance", "444.66");
    const defaultTransactions = [
      "You received: $10,000 from paycheck",
      "You spent: $5 on milk"
    ];
    localStorage.setItem("transactions", JSON.stringify(defaultTransactions));
  }
}

// Loads all data from localStorage and updates the HTML
function loadAppData() {
  // 1. Load and display the balance
  const balance = localStorage.getItem("balance");
  document.getElementById("homeBalance").textContent = `$${parseFloat(balance).toFixed(2)}`;
  
  // 2. Load and display transactions
  const transactions = JSON.parse(localStorage.getItem("transactions"));
  
  const homeList = document.getElementById("homeTransactionList");
  const expenseList = document.getElementById("expenseList");
  
  homeList.innerHTML = "";
  expenseList.innerHTML = "";

  // ... inside loadAppData(), find this loop:
transactions.reverse().forEach(text => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "transaction-text"; // Add a class to find the text
    span.textContent = text;

    const close = document.createElement("span");
    close.className = "close"; // The "x" button
    close.textContent = "×";

    li.appendChild(span);
    li.appendChild(close);

    // Add to Home screen list
    homeList.appendChild(li);

    // Add to Transactions screen list (we need a copy)
    expenseList.appendChild(li.cloneNode(true));
});
  renderBudgets();
}

/*----------------------*/
/* BUDGET SCREEN LOGIC  */
/*----------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const addBudgetBtn = document.getElementById("addBudgetBtn");
  if (addBudgetBtn) {
    addBudgetBtn.addEventListener("click", addBudgetItem);
  }
});

function addBudgetItem() {
  const category = document.getElementById("budgetCategoryInput").value;
  const limit = parseFloat(document.getElementById("budgetLimit").value);

  if (!category || isNaN(limit) || limit <= 0) {
    alert("Please enter a valid category and limit.");
    return;
  }

  // Load existing budgets or start new list
  let budgets = JSON.parse(localStorage.getItem("budgets")) || [];

  // Prevent duplicate categories
  const existing = budgets.find(b => b.category === category);
  if (existing) {
    alert("That category already has a limit set!");
    return;
  }

  // Add new item
  budgets.push({ category, spent: 0, limit });
  localStorage.setItem("budgets", JSON.stringify(budgets));

  // Update UI
  renderBudgets();
  document.getElementById("budgetLimit").value = "";

  // Switch back to home
  showScreen('screen-home');
}

/* Load and render all budgets into the Home screen */
function renderBudgets() {
  const homeSection = document.querySelector("#screen-home .home-section:nth-of-type(2)");
  const container = homeSection.querySelectorAll(".budget-item");
  
  // Clear old progress bars (except title)
  homeSection.innerHTML = `
    <h3 class="home-section-title">Budget Progress</h3>
  `;

  const budgets = JSON.parse(localStorage.getItem("budgets")) || [];

  budgets.forEach(b => {
    const percent = Math.min((b.spent / b.limit) * 100, 100);
    const item = document.createElement("div");
    item.className = "budget-item";
    item.innerHTML = `
      <div class="budget-label">
        <span>${b.category}</span>
        <span>$${b.spent} / $${b.limit}</span>
      </div>
      <div class="progress-bar">
        <div class="progress" style="width:${percent}%;"></div>
      </div>
    `;
    homeSection.appendChild(item);
  });
}


/*"ADD" SCREEN LOGIC*/
function showChoices() {
  const radio = document.querySelector('input[name="opt"]:checked');
  const category = document.getElementById("categoryInput").value;
  const amountString = document.getElementById("amountInput").value;
  const date = document.getElementById("dateInput").value;
  
  if (!radio || amountString === "" || date === "") {
    alert("Please fill out all fields.");
    return;
  }

  const amount = parseFloat(amountString);
  let newExpenseText = "";
  let currentBalance = parseFloat(localStorage.getItem("balance"));

  if (radio.value == "A") { // Income
    newExpenseText = `You received: $${amount.toFixed(2)} from ${category}`;
    currentBalance += amount;
  } else { // Expense
    newExpenseText = `You spent: $${amount.toFixed(2)} on ${category}`;
    currentBalance -= amount;
  }

  // --- Update Budget Progress Automatically ---
  let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
  const b = budgets.find(b => b.category === category);
  if (b) {
    b.spent += amount;
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }

  // Save new balance
  localStorage.setItem("balance", currentBalance.toString());

  // Get old transaction list, add new one, save it back
  const transactions = JSON.parse(localStorage.getItem("transactions"));
  transactions.push(newExpenseText);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Refresh the App Data
  loadAppData();

  // Clear inputs
  document.getElementById("amountInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("categoryInput").value = "";
  document.querySelector('input[name="opt"][value="B"]').checked = true; // Reset to "Expense"

  // Switch back to the home tab to see the change
  showScreen('screen-home');
}


/*"TODO" SCREEN LOGIC*/
function addTaskFromInput() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (!value) return;

  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = value;
  const close = document.createElement("span");
  close.className = "close";
  close.textContent = "×";
  li.appendChild(span);
  li.appendChild(close);
  
  document.getElementById("taskList").appendChild(li);
  input.value = "";
  input.focus();
}

function wireTodoList() {
  const list = document.getElementById("taskList");
  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("close")) {
      e.target.closest("li").remove();
    }
  });
}

function wireTransactionList() {

  const handleDelete = (e) => {

    if (!e.target.classList.contains('close')) return;
    
    const li = e.target.closest('li');
    if (!li) return; // Exit if we couldn't find the list item
    
    const textSpan = li.querySelector('.transaction-text');
    if (!textSpan) return; // Exit if the text doesn't exist
    
    const text = textSpan.textContent;
    
    let transactions = JSON.parse(localStorage.getItem("transactions"));
    let currentBalance = parseFloat(localStorage.getItem("balance"));
    
    const amountMatch = text.match(/(\d+\.\d{2})/); 
    
    if (amountMatch) {
        const amount = parseFloat(amountMatch[1]);
        
        if (text.startsWith("You spent")) {
            currentBalance += amount; // Add back the expense
        } else if (text.startsWith("You received")) {
            currentBalance -= amount; // Subtract the income
        }
        
        localStorage.setItem("balance", currentBalance.toString());
    }

    // 5. Filter and save the transaction list
    transactions = transactions.filter(t => t !== text);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    // 6. Reload all data
    loadAppData();
  };

  // Attach this logic to both lists
  document.getElementById('homeTransactionList').addEventListener('click', handleDelete);
  document.getElementById('expenseList').addEventListener('click', handleDelete);
}


function addProfile(id) {
  const container = document.getElementById(id);

  const num = id.replace("addProfileBtn", "");
  const usernameDiv = document.getElementById(`username${num}`);

  const username = prompt("Enter new user's name:");

  if (username) {
    container.style.backgroundColor = "transparent";
    container.innerHTML = `
      <img src="images/default_profile.avif"
           style="width:150px;height:150px;border-radius:50%;object-fit:cover;">
    `;
    usernameDiv.textContent = username;
  }
}
