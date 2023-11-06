import {
    supa
  } from "/js/supabase.js";


  // Logout logic
async function logout() {
  const { error } = await supa.auth.signOut();
  if (error) {
      console.error("Error during logout:", error);
  } else {
      updateUserStatus(null);
      window.location.href = 'index.html';
      console.log("User logged out successfully.");
  }
}

let logoutButton = document.getElementById('btn-logout')
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

// Function to update user status
function updateUserStatus(user) {

  if (user) {
      console.log(`Authenticated as: ${user.email}`);
  } else {
      console.log("Not authenticated.");
  }
}

// Check and display the initial user status
const initialUser = supa.auth.user();
updateUserStatus(initialUser);


  async function displayProfile() {
    const { data: user, error } = await supa.from("user").select();
    user.forEach(user => {
       if(user.user_id === supa.auth.user().id){
        document.getElementById('user-name').innerHTML = user.first_name + " " + user.name;
        document.getElementById('user-img').src = user.user_img;
       }
    })
}

  export { displayProfile };


  async function displayRiddenMaps() {
    const { data, error } = await supa
        .from("user_ridden_maps")
        .select("*")
        .eq("maps_id", maps.id)
        .eq("user_id", supa.auth.user().id);

        if (data.length > 0) {
          
        }
    } 
  

  export { displayRiddenMaps };
  
