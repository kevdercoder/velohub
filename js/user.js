import { supa } from "/js/supabase.js";


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
    const {
      data: riddenMaps,
      error
    } = await supa
    .from("done")
    .select(`
                maps_id, 
                maps (id)
            `)
    .eq('user_id', supa.auth.user().id);
    
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log(riddenMaps);
    }

    riddenMaps.forEach(riddenMaps => {
      let sectionMaps = document.createElement('section');
      sectionMaps.className = 'container-maps';
      sectionMaps.id = riddenMaps.id;
  
      //Display the maps in the list view
      async function displayOverview() {
        sectionMaps.innerHTML = `
          <div class="maps-img-container">
            <img class="maps-map-small" src="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${riddenMaps.id}" alt="image-alt">
            <img id="${riddenMaps.id}" class="maps-checkmark" style="display: none" src="/img/icon-checkmark-dark.svg" alt="checkmark">
          </div>
          <div class="maps-margin">
            <h2></h2>
            <ul>
              <li class="maps-distance">
                <img src="/img/icon-distance.svg" alt="image-alt">
                <p></p>
              </li>
              <li class="maps-distance">
                <img src="/img/icon-up.svg" alt="image-alt">
                <p></p>
              </li>
              <li class="maps-distance">
                <img src="/img/icon-down.svg" alt="image-alt">
                <p></p>
              </li>
            </ul>
            <div class="maps-filters"></div>
          </div>
        `;
  
        document.body.appendChild(sectionMaps);
        const hr = document.createElement('hr');
        hr.className = 'maps-seperator';


      document.querySelector('main').appendChild(sectionMaps);
      document.querySelector('main').appendChild(hr)
}
displayOverview();
    })
  }
  

  export { displayRiddenMaps };
  
