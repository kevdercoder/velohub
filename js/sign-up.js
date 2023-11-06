import { supa } from "/js/supabase.js";

let lastSelectedProfilePicture = null;

// Function to sign up using email and password
async function signUp() {
    const email = document.getElementById('join-email').value;
    const password = document.getElementById('join-password').value;
    const firstName = document.getElementById('join-firstname').value;
    const name = document.getElementById('join-name').value;
  
    const { user, error } = await supa.auth.signUp({ email, password });
  
    if (error) {
      console.error("Error during sign up: ", error.message);
    } else {
      //console.log("User signed up successfully:", user);
  
      //Insert the UUID of the user into the "user" table
      const { data, error } = await supa
        .from("user")
        .insert({
          user_id: user.id,
          first_name: firstName,
          name: name,
          email: email,
          user_img: '0' + lastSelectedProfilePicture + '_profile_picture.JPG'
        });
  
      if (error) {
        console.log("Error inserting data:", error.message);
      } else {
        console.log("Data inserted successfully:", data);
        window.location.href = 'confirm-email.html';
      }
    }
  }


  document.querySelectorAll('#profile-picture-options label').forEach(function(label) {
    label.addEventListener('click', function() {
      const radioInput = this.querySelector('input[type="radio"]');
      radioInput.checked = true;
  
      // Update the last selected profile picture
      lastSelectedProfilePicture = radioInput.value;
      console.log(lastSelectedProfilePicture)
  
      // Add the selected class for visual indicator
      document.querySelectorAll('#profile-picture-options label').forEach(function(label) {
        label.classList.remove('selected-img');
      });
      this.classList.add('selected-img');
    });
  });
  


    // Attach event listeners to the sign up buttons
    let submitJoinButton = document.getElementById('submit-join');
      submitJoinButton.addEventListener('click', signUp);

    