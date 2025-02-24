document.addEventListener("DOMContentLoaded", function () {
    initializeDarkMode();
    initializeExpenseTracker();
});

// ================= DARK MODE =================
function initializeDarkMode() {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;

    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            darkModeToggle.classList.remove("btn-dark");
            darkModeToggle.classList.add("btn-light");
            darkModeToggle.textContent = "Light Mode";
        } else {
            darkModeToggle.classList.remove("btn-light");
            darkModeToggle.classList.add("btn-dark");
            darkModeToggle.textContent = "Dark Mode";
        }
    });
}

// ================= EXPENSE TRACKER =================
const expenses = []; // Store expense objects for filtering & sorting

function initializeExpenseTracker() {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const filterCategory = document.getElementById("filter-category");
    const sortByDate = document.getElementById("sort-date");

    expenseForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addExpense();
    });

    expenseList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-expense")) {
            deleteExpense(event);
        }
    });

    filterCategory.addEventListener("change", filterExpenses);
    sortByDate.addEventListener("change", sortExpenses);
}

// Function to add an expense
function addExpense() {
    const amountInput = document.getElementById("amount");
    const amount = parseFloat(amountInput.value);
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();
    const date = document.getElementById("date").value;

    if (!amount || isNaN(amount)) {
        showToast("Enter an valid Integer!", "error")
        return;
    }
    if (amount <=0) {
        showToast("Amount should be greater than 0!", "error")
        return;
    }
    if (amount > 100000){
        showToast("Amount should be less than 100000!", "error");
        return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
        showToast("Invalid amount format!", "error");
    }


    if (!validateExpense(category, date)) {
        alert("Please enter a valid Category, and Date.");
        return;
    }

    const expenseObj = {
        id: Date.now(),
        amount: parseFloat(amount),
        category,
        description: description || "N/A",
        date
    };

    expenses.push(expenseObj);
    renderExpenses(expenses);

    showToast("Expense added successfully !!")

    document.getElementById("expense-form").reset();
}

// Function to delete an expense
function deleteExpense(event) {
    const row = event.target.closest("tr");
    const expenseId = parseInt(row.dataset.id);
    
    const index = expenses.findIndex(exp => exp.id === expenseId);
    if (index !== -1) {
        expenses.splice(index, 1);
        renderExpenses(expenses);
        showToast("Expense deleted successfully", "success")
    }
}

// Function to validate expense input
function validateExpense(amount, category, date) {
    return !(amount === "" || isNaN(amount) || category === "" || date === "");
}

// Function to render expenses in the table
function renderExpenses(filteredExpenses) {
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    filteredExpenses.forEach((expense, index) => {
        const newRow = document.createElement("tr");
        newRow.dataset.id = expense.id;
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>$${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>${expense.date}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-expense">Delete</button>
            </td>
        `;

        expenseList.appendChild(newRow);
    });
}

// ================= FILTER & SORT =================

// Function to filter expenses by category
function filterExpenses() {
    const selectedCategory = document.getElementById("filter-category").value;
    
    if (selectedCategory === "All") {
        renderExpenses(expenses);
    } else {
        const filtered = expenses.filter(expense => expense.category === selectedCategory);
        renderExpenses(filtered);
    }
}

// Function to sort expenses by date
function sortExpenses() {
    const sortOrder = document.getElementById("sort-date").value;

    const sortedExpenses = [...expenses].sort((a, b) => {
        return sortOrder === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
    });

    renderExpenses(sortedExpenses);
}



// Show Toast Notification
function showToast(message, type = "success") {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",  // 'top' or 'bottom'
        position: "right", // 'left', 'center' or 'right'
        backgroundColor: type === "success" 
            ? "linear-gradient(to right, #00b09b, #96c93d)"  // Green gradient for success
            : "linear-gradient(to right, #ff416c, #ff4b2b)", // Red gradient for error
        stopOnFocus: true,
    }).showToast();
}

