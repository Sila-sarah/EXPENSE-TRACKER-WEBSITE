// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent the default form submission
      
      // Get form values
      const date = document.getElementById('date').value;
      const category = document.getElementById('category').value;
      const amount = document.getElementById('amount').value;
      const description = document.getElementById('description').value;
      const paymentMethod = document.getElementById('payment-method').value;
      
      // Validate form inputs
      if (!date || !category || !amount || !paymentMethod) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Create an expense object
      const expense = {
        date,
        category,
        amount,
        description,
        paymentMethod
      };
      
      // Here, you would typically send this data to a server
      console.log('Expense data:', expense);
      
      // For demonstration purposes, clear the form after submission
      form.reset();
      
      // Optionally, display a success message
      alert('Expense added successfully!');
    });
  });
  