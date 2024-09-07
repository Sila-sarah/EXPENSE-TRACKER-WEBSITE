document.addEventListener("DOMContentLoaded", function () {
    const benefitsList = document.querySelector(".content ul");
  
    // Example: Add a dynamic welcome message based on the time of day
    const greetingMessage = document.createElement("p");
    const currentHour = new Date().getHours();
  
    if (currentHour < 12) {
      greetingMessage.textContent = "Good morning! Keep track of your expenses today.";
    } else if (currentHour < 18) {
      greetingMessage.textContent = "Good afternoon! How are your expenses going?";
    } else {
      greetingMessage.textContent = "Good evening! Review your expenses for the day.";
    }
  
    greetingMessage.style.color = "green";
    benefitsList.parentElement.insertBefore(greetingMessage, benefitsList);
  
    // Example: Highlight specific benefits dynamically
    const benefits = benefitsList.querySelectorAll("li");
    benefits.forEach((benefit, index) => {
      if (index % 2 === 0) {
        benefit.style.fontWeight = "bold";
      }
    });
  });
  