document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();
  
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
  
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: email, password })
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert('Registration successful! Redirecting to login page...');
          window.location.href = 'login.html';
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while registering. Please try again later.');
      }
    });
  });
  