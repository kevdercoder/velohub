import { supa } from "/js/supabase-setup.js";
  
  // Attach event listeners to the login button
  let submitLoginButton = document.getElementById('submit-login');
  if (submitLoginButton) {
    submitLoginButton.addEventListener('click', login);
  }
  
  
  // Function to login using email and password
  async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    const { user, error } = await supa.auth.signIn({ email, password });
  
  
    if (error) {
      console.error("Error during login: ", error.message);
    } else {
      console.log("Logged in as ", email);
      
      window.location.href = 'profile.html';
    }
  }
  
