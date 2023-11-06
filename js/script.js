import { supa } from "/js/supabase-setup.js";


// Get the current page URL
const currentUrl = window.location.href;

console.log(currentUrl);

// Get all the links in the navigation menu
const links = document.querySelectorAll('.mobile-nav a');

// Loop through the links and add the active class to the current link
links.forEach(link => {
  if (link.href === currentUrl) {
    link.id = 'mobile-nav-active-link';

    // Find the SVG element within the link
    const svgIcon = link.querySelector('.mobile-nav-icon');

    if (svgIcon) {
      svgIcon.id = 'mobile-nav-active-icon';
    }
  }
});


import { shuffleMaps } from "./maps.js";
/* 
 * This section handles the login and sign up functionality.
 * Aditionally it manages the current user status. 
 */

// Function to update user status
function updateUserStatus(user) {
  const userStatusElement = document.getElementById('userStatus');

  if (user) {
      console.log(`Authenticated as: ${user.email}`);
  } else {
      console.log("Not authenticated.");
  }
}

// Check and display the initial user status
const initialUser = supa.auth.user();
updateUserStatus(initialUser);


// Listener for authentication state changes
supa.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
      console.log("User signed in: ", session.user);
      updateUserStatus(session.user);
  } else if (event === "SIGNED_OUT") {
      console.log("User signed out");
      updateUserStatus(null);
  }
});



// Save filter choice in local storage 
const btnFilterDistance = document.querySelectorAll('.btn-filter-distance');
const btnFilterAltitude = document.querySelectorAll('.btn-filter-altitude');
const btnList = document.querySelectorAll('.btn-list');

btnFilterDistance.forEach((btn) => {
  btn.addEventListener('click', () => {
    
    btnFilterDistance.forEach((otherBtn) => {
      if (otherBtn !== btn) {
        otherBtn.classList.remove('btn-filter-distance-active');
      }
    });

    if (btn.classList.contains('btn-filter-distance-active')) {
      btn.classList.remove('btn-filter-distance-active');
      localStorage.removeItem('btnFilterDistance');
    } else {
      btn.classList.add('btn-filter-distance-active');
      localStorage.setItem('btnFilterDistance', btn.id);
    }
    
    console.log(localStorage.getItem('btnFilterDistance'))
  });
});

btnFilterAltitude.forEach((btn) => {
  btn.addEventListener('click', () => {


    btnFilterAltitude.forEach((otherBtn) => {
      if (otherBtn !== btn) {
        otherBtn.classList.remove('btn-filter-distance-active');
      }
    });

    if (btn.classList.contains('btn-filter-distance-active')) {
      btn.classList.remove('btn-filter-distance-active');
      localStorage.removeItem('btnFilterAltitude');
    } else {
      btn.classList.add('btn-filter-distance-active');
      localStorage.setItem('btnFilterAltitude', btn.id);
    }

    console.log(localStorage.getItem('btnFilterAltitude'))
  });
});

//activate button as default
if (document.contains(document.getElementById('single-route'))) {
  document.getElementById('list-overview').classList.add('btn-filter-distance-active')
}


btnList.forEach((btn) => {
  btn.addEventListener('click', () => {
    btnList.forEach((otherBtn) => {

      if (otherBtn !== btn) {
        otherBtn.classList.remove('btn-filter-distance-active');
      }
    });

    if (!btn.classList.contains('btn-filter-distance-active')) {
      btn.classList.add('btn-filter-distance-active');
    }

    localStorage.setItem('btnList', btn.id);
    
  });
});


if (document.querySelector('.btn-submit')) {
let btnSubmit = document.querySelector('.btn-submit');
let singleRoute = document.querySelector('#single-route');


btnSubmit.addEventListener('click', async () => {

  if (singleRoute.classList.contains('btn-filter-distance-active')) {
      // Redirect to the single-map.html page
      window.location.href = '/single-map.html';
   
} else {
    // Redirect to the overview-maps.html page
    window.location.href = 'overview-maps.html';
}
});
}

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/overview-maps.html') {
    // Dynamically load the map-overview.js file
    const { showMaps } = await import('./maps.js');
     
    showMaps();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/single-map.html') {
    // Dynamically load the map-overview.js file

    const { shuffleMaps } = await import('./maps.js');
     
    shuffleMaps();
  }
});


window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/single-map.html') {
    // Dynamically load the map-overview.js file
    const { displayMap } = await import('./maps.js');
     
    displayMap();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/community.html') {
    // Dynamically load the map-overview.js file
    const { community } = await import('./community.js');
     
    community();
  }
});


let navProfile = document.getElementById('mobile-nav-profile');
if (navProfile) {
  navProfile.addEventListener('click', async () => {
    if(supa.auth.user() === null) {
      window.location.href = 'user-login.html';
    } else {
      window.location.href = 'profile.html';
     
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/profile.html') {
    // Dynamically load the map-overview.js file
    const { displayProfile } = await import('./user.js');
     
    displayProfile();
  }
});





// Check if the user is on the index page and reset local storage of filter elements
if (window.location.pathname === '/index.html') {
  localStorage.removeItem('btnFilterDistance');
  localStorage.removeItem('btnFilterAltitude');
  localStorage.removeItem('btnList');
}

