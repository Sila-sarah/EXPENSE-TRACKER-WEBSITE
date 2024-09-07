document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
  
    // Fetch existing expense data to prefill the form (assuming you have the expense ID)
    const expenseId = getExpenseIdFromURL(); // Implement this function to extract expense ID from URL
  
    async function fetchExpenseData() {
      try {
        const response = await fetch(`/api/expenses/${expenseId}`);
        if (response.ok) {
          const expense = await response.json();
          document.getElementById("date").value = expense.date;
          document.getElementById("category").value = expense.category;
          document.getElementById("amount").value = expense.amount;
          document.getElementById("description").value = expense.description;
          document.getElementById("payment-method").value = expense.paymentMethod;
        } else {
          alert("Failed to fetch expense data.");
        }
      } catch (error) {
        console.error("Error fetching expense data:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  
    fetchExpenseData();
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const date = document.getElementById("date").value;
      const category = document.getElementById("category").value;
      const amount = document.getElementById("amount").value;
      const description = document.getElementById("description").value;
      const paymentMethod = document.getElementById("payment-method").value;
  
      try {
        const response = await fetch(`/api/expenses/${expenseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            category,
            amount,
            description,
            paymentMethod,
          }),
        });
  
        if (response.ok) {
          alert("Expense updated successfully!");
          window.location.href = "view-expense.html"; // Redirect to view expense page
        } else {
          alert("Failed to update expense.");
        }
      } catch (error) {
        console.error("Error updating expense:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  
    function getExpenseIdFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get("id"); // Assuming the expense ID is passed as a query parameter
    }
  });
  

