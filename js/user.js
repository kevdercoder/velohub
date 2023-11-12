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
        document.getElementById('user-additional').innerHTML = 'Rennvelofahrer:in';
        document.getElementById('user-img').src = user.user_img;
       }
    })

     // Hide skeleton-loading after maps are loaded
        let skeletonLoading = document.querySelector('.skeleton-loading');
        skeletonLoading.style.display = 'none';

       document.getElementById('user-name').style.display = 'block';
       document.getElementById('user-img').style.display = 'block';
}

  export { displayProfile };


  async function displayRiddenMaps() {
    const { data: riddenMaps, error } = await supa
      .from("done")
      .select(`
        maps_id, 
        maps (*)
      `)
      .eq('user_id', supa.auth.user().id);
  
    if (error) {
      console.error("Error fetching data:", error);
    }
  
    if (riddenMaps.length === 0) {
      showBackButton();
      document.querySelector('.profile-option-none').style.display = 'flex';
      return;
    }
  
    riddenMaps.forEach(riddenMaps => {
      let sectionMaps = document.createElement('section');
      sectionMaps.className = 'container-maps';
      sectionMaps.id = riddenMaps.id;
  
      // Display the maps in the list view
      async function displayOverview() {
        sectionMaps.innerHTML = `
          <div class="maps-img-container">
            <img class="maps-map-small" src="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${riddenMaps.maps.map_img}" alt="image-alt">
            <img id="${riddenMaps.maps.id}" class="maps-checkmark" style="display: none" src="/img/icon-checkmark-dark.svg" alt="checkmark">
          </div>
          <div class="maps-margin">
            <h2>${riddenMaps.maps.map_name}</h2>
            <ul>
              <li class="maps-distance">
                <img src="/img/icon-distance.svg" alt="image-alt">
                <p>${riddenMaps.maps.distance}km</p>
              </li>
              <li class="maps-distance">
                <img src="/img/icon-up.svg" alt="image-alt">
                <p>${riddenMaps.maps.altitude_up}m</p>
              </li>
              <li class="maps-distance">
                <img src="/img/icon-down.svg" alt="image-alt">
                <p>${riddenMaps.maps.altitude_down}m</p>
              </li>
            </ul>
            <div class="maps-filters ${riddenMaps.maps.altitude}">${riddenMaps.maps.altitude}</div>
          </div>
        `;
  
        document.body.appendChild(sectionMaps);
        const hr = document.createElement('hr');
        hr.className = 'maps-seperator';
  
        document.querySelector('main').appendChild(sectionMaps);
        document.querySelector('main').appendChild(hr);
  
        // Add event listener to redirect to single-map.html
        sectionMaps.addEventListener('click', () => {
          localStorage.setItem('mapId', riddenMaps.maps.id);
          window.location.href = '/single-map.html';
        });
  
        showBackButton();
      }
  
      displayOverview();
    });
  }
  

  export { displayRiddenMaps };
  

  
  async function displayPastTour() {
    const {
      data: pastTour,
      error
    } = await supa
    .from("past_tour")
    .select(`
                *,
                maps_id, 
                maps (*)
            `)
    .eq('user_id', supa.auth.user().id);

    if (pastTour.length === 0) {
      showBackButton(); // Call a function to display the back button
      document.querySelector('.profile-option-none').style.display = 'flex'
      return;
    }

    console.log(pastTour.start_time);

    pastTour.forEach(pastTour => {
      let sectionMaps = document.createElement('section');
      sectionMaps.className = 'container-maps';
      sectionMaps.id = pastTour.id;
     
      let formattedDateTime = formatDateTime(pastTour.start_time);
  
      //Display the maps in the list view
      async function displayOverview() {
        sectionMaps.innerHTML = `
          <div class="maps-img-container">
            <img class="maps-map-small" src="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${pastTour.maps.map_img}" alt="image-alt">
            <img id="${pastTour.maps.id}" class="maps-checkmark" style="display: none" src="/img/icon-checkmark-dark.svg" alt="checkmark">
          </div>
          <div class="maps-margin">
            <h2>${pastTour.maps.map_name}</h2>
            <ul>
              <li class="maps-distance">
                <img src="/img/icon-calendar.svg" alt="image-alt">
                <p>${formattedDateTime.formattedDate}</p>
              </li>
              <li class="maps-distance">
                <img src="/img/icon-clock.svg" alt="image-alt">
                <p>${formattedDateTime.formattedTime}</p>
              </li>
            </ul>
        `;
  
        document.body.appendChild(sectionMaps);
        const hr = document.createElement('hr');
        hr.className = 'maps-seperator';


      document.querySelector('main').appendChild(sectionMaps);
      document.querySelector('main').appendChild(hr)

      document.querySelector('.btn-back').innerHTML = 'Zurück';
      document.querySelector('#icon-chevron').style.display = 'block';
}
displayOverview();
    })

  }

  export { displayPastTour };


  async function displayPlannedTour() {
    const {
      data: plannedTour,
      error
    } = await supa
      .from("tour_x")
      .select(`
                  *,
                  maps_id, 
                  maps (*)
              `)
      .eq('user_id', supa.auth.user().id);
  
    // Check if there are no planned tours
    if (plannedTour.length === 0) {
      showBackButton(); // Call a function to display the back button
      document.querySelector('.profile-option-none').style.display = 'flex'
      return;
    }
  
  
    plannedTour.forEach(plannedTour => {
      let sectionMaps = document.createElement('section');
      sectionMaps.className = 'container-maps';
      sectionMaps.id = plannedTour.id;
  
      let formattedDateTime = formatDateTime(plannedTour.start_time);
  
      // Display the maps in the list view
      async function displayOverview() {
        sectionMaps.innerHTML = `
            <div class="maps-img-container">
              <img class="maps-map-small" src="https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${plannedTour.maps.map_img}" alt="image-alt">
              <img id="${plannedTour.maps.id}" class="maps-checkmark" style="display: none" src="/img/icon-checkmark-dark.svg" alt="checkmark">
            </div>
            <div class="maps-margin">
              <h2>${plannedTour.maps.map_name}</h2>
              <ul>
                <li class="maps-distance">
                  <img src="/img/icon-calendar.svg" alt="image-alt">
                  <p>${formattedDateTime.formattedDate}</p>
                </li>
                <li class="maps-distance">
                  <img src="/img/icon-clock.svg" alt="image-alt">
                  <p>${formattedDateTime.formattedTime}</p>
                </li>
              </ul>
            </div>
          `;
  
        document.body.appendChild(sectionMaps);
        const hr = document.createElement('hr');
        hr.className = 'maps-seperator';
  
        document.querySelector('main').appendChild(sectionMaps);
        document.querySelector('main').appendChild(hr);
  
        showBackButton(); // Call a function to display the back button
      }
  
      displayOverview();
  
      // Add event listener to redirect to community tour
      sectionMaps.addEventListener('click', () => {
        localStorage.setItem('communityId', plannedTour.id);
        window.location.href = `community-maps.html?${plannedTour.id}`;
      });
    });
  }
  
  function showBackButton() {
    // Your logic to show the back button
    document.querySelector('.btn-back').innerHTML = 'Zurück';
    document.querySelector('#icon-chevron').style.display = 'block';
  }

  export { displayPlannedTour };


  function formatDateTime(dateTimeString) {
    let date = new Date(dateTimeString);
    let options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    let formattedDate = date.toLocaleDateString('de-DE', options);
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let formattedTime = `${hours}:${minutes}`;
    return {
      formattedDate,
      formattedTime
    };
  }