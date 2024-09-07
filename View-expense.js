document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/expenses');
    const expenses = await response.json();
    const expensesList = document.getElementById('expenses-list');

    expenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.innerHTML = `
            <p>Amount: ${expense.amount}</p>
            <p>Date: ${expense.date}</p>
            <p>Category: ${expense.category}</p>
            <a href="edit.html?id=${expense.id}">Edit</a>
            <button onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        expensesList.appendChild(expenseItem);
    });
});

async function deleteExpense(id) {
    const response = await fetch(`/api/expenses/delete/${id}`, { method: 'DELETE' });
    if (response.ok) {
        alert('Expense deleted successfully');
        window.location.reload();
    } else {
        alert('Failed to delete expense');
    }
}
