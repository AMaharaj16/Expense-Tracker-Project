const expenseName = document.getElementById('expense-name')
const expenseCost = document.getElementById('expense-cost')
const expenseCategory = document.getElementById('select-category')
const totals = {};

function addExpense() {
    let name = expenseName.value.trim()
    let cost = parseFloat(expenseCost.value.trim())
    let category = expenseCategory.value
    if (!name || !cost || !category) {
        alert("Please fill in all fields!");
        return;
    }

    if (isNaN(cost)) {
        alert("Please enter a valid number for cost.")
        return
    }

    var ul = document.querySelector(`#${expenseCategory.value} ul`);
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(`${name} - $${expenseCost.value}`));
    ul.appendChild(li);

    var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-button';
        deleteBtn.style.marginLeft = '10px'; // spacing
        deleteBtn.onclick = function () {
            ul.removeChild(li); // remove this <li> from the list
            totals[category] -= cost
            updateTotal(category)
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