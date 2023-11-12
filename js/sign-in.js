import {
  supa
} from "/js/supabase.js";

// Attach event listeners to the login button
let submitLoginButton = document.getElementById('submit-login');
if (submitLoginButton) {
  submitLoginButton.addEventListener('click', login);
}

// Function to login using email and password
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    console.error("Email or password missing");
    return;
  }

  const {
    user,
    error
  } = await supa.auth.signIn({
    email,
    password
  });


  if (error) {
    console.error("Error during login: ", error.message);
  } else {
    console.log("Logged in as ", email);

    window.location.href = 'profile.html';
  }
}


let submitButton = document.getElementById("submit-login");

document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
  let keyCode = e.keyCode;
  if (keyCode == 13) {
    submitButton.click();
  }
}