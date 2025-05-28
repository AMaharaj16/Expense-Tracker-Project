const expenseName = document.getElementById('expense-name')
const expenseCost = document.getElementById('expense-cost')
const expenseCategory = document.getElementById('select-category')
const totals = {};
let expenses = [];
// Saves list of expenses to browser local storage under key 'expenses'
function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}
// Retrieves all expenses
function loadFromLocalStorage() {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
}
// Had to attach the id to the onlick function here due to parameters in the function.
document.getElementById('add-expense').addEventListener('click', function () {
    const name = expenseName.value.trim();
    const cost = parseFloat(expenseCost.value.trim());
    const category = expenseCategory.value;
    addExpense(name, cost, category, false);
});

function addExpense(name = null, cost = null, category = null, fromLoad = false) {
    if (!name || !cost || !category) {
        alert("Please fill in all fields!");
        return;
    }

    if (isNaN(cost)) {
        alert("Please enter a valid number for cost.")
        return
    }

    var ul = document.querySelector(`#${category} ul`);
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(`${name} - $${cost}`));
    ul.appendChild(li);

    var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-button';
        deleteBtn.style.marginLeft = '10px'; // spacing
        deleteBtn.onclick = function () {
            ul.removeChild(li); // remove this <li> from the list
            totals[category] -= cost
            updateTotal(category)
            expenses = expenses.filter(e => !(e.name === name && e.cost === cost && e.category === category)); // Remove expense from expenses with the same name, cost, and category
            saveToLocalStorage();
        };

    // Add delete button to the <li>
    li.appendChild(deleteBtn);

    // Add the <li> to the category <ul>
    ul.appendChild(li);

    if (!totals[category]) {
        totals[category] = 0;
    } 
        
    totals[category] += cost;
    updateTotal(category);

    if (!fromLoad) {
        expenses.push({name,cost,category}); // Add new expense to expenses list and save to local storage.
        saveToLocalStorage();
    }

    expenseName.value = '';
    expenseCost.value = '';
    expenseCategory.value = '';
}

function updateTotal(category) {
    const categoryTotal = document.getElementById(`total-${category}`);
    categoryTotal.textContent = `Total: $${totals[category]}`
}

function generateVisualizations() {
    let dataPie = [{
        values: Object.values(totals),
        labels: Object.keys(totals),
        type: 'pie'
    }]

    let dataBar = [{
        x: Object.keys(totals),
        y: Object.values(totals),
        type: 'bar'
    }]

    Plotly.newPlot("PiePlot", dataPie);
    Plotly.newPlot("BarPlot", dataBar);
}

// Retrieve all expenses and save to the expenses list, then call addExpense on each expense.
window.onload = function () {
    expenses = loadFromLocalStorage();
    expenses.forEach(exp => addExpense(exp.name, exp.cost, exp.category, true));
};