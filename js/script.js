import {
  supa
} from "/js/supabase.js";

// Get the current page URL and links
let currentUrl = window.location.href;
let links = document.querySelectorAll('.mobile-nav a');

// Loop through the links and add the active class to the current link
links.forEach(link => {
  if (link.href === currentUrl) {
    link.id = 'mobile-nav-active-link';

    // Find the SVG element within the link
    let svgIcon = link.querySelector('.mobile-nav-icon');

    if (svgIcon) {
      svgIcon.id = 'mobile-nav-active-icon';
    }
  }
});

/* 
 * This section manages the current user status. 
 */

// Function to update user status
function updateUserStatus(user) {

  if (user) {
    console.log(`Authenticated as: ${user.email}`);
  } else {
    console.log("Not authenticated.");
  }
}

// Check and display the initial user status
let initialUser = supa.auth.user();
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
let btnFilterDistance = document.querySelectorAll('.btn-filter-distance');
let btnFilterAltitude = document.querySelectorAll('.btn-filter-altitude');
let btnList = document.querySelectorAll('.btn-list');

// Event listener for distance filter buttons
btnFilterDistance.forEach((btn) => {
  btn.addEventListener('click', () => {

    // Remove class from other buttons
    btnFilterDistance.forEach((otherBtn) => {
      if (otherBtn !== btn) {
        otherBtn.classList.remove('btn-filter-distance-active');
      }
    });

    if (btn.classList.contains('btn-filter-distance-active')) {
      // If button is active, deactivate and remove from local storage
      btn.classList.remove('btn-filter-distance-active');
      localStorage.removeItem('btnFilterDistance');
    } else {
      // If button is not active, activate and save to local storage
      btn.classList.add('btn-filter-distance-active');
      localStorage.setItem('btnFilterDistance', btn.id);
    }

    //console.log(localStorage.getItem('btnFilterDistance'))
  });
});

// Event listener for altitude filter buttons
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

    //console.log(localStorage.getItem('btnFilterAltitude'))
  });
});

// Activate button as default element
if (document.contains(document.getElementById('single-route'))) {
  document.getElementById('list-overview').classList.add('btn-filter-distance-active')
}

// Event listener for list buttons
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

// Check if the user is on the index page and reset local storage of filter elements
if (window.location.pathname === '/index.html') {
  localStorage.removeItem('btnFilterDistance');
  localStorage.removeItem('btnFilterAltitude');
  localStorage.removeItem('btnList');
}

// Check if a submit button is present
if (document.querySelector('.btn-submit')) {
  let btnSubmit = document.querySelector('.btn-submit');
  let singleRoute = document.querySelector('#single-route');

  // Event listener for submit button click
  btnSubmit.addEventListener('click', async () => {

    if (singleRoute.classList.contains('btn-filter-distance-active')) {
      // Redirect to the single-map.html page

      // Set the shouldShuffle flag to true
      localStorage.setItem('shouldShuffle', 'true');

      // Import the shuffleMaps function dynamically
      const {
        shuffleMapsIndex
      } = await import('./maps.js');
      // Call the imported function and wait for the shuffled maps
      await shuffleMapsIndex();

    } else {
      // Redirect to the overview-maps.html page
      window.location.href = '/overview-maps.html';
    }
  });
}


/* 
 * This section handles different event listeners to dynamically load 
 * different JavaScript files based on page location.
 */

// Event listener for maps feature
window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/overview-maps.html') {
    let {
      showMaps
    } = await import('./maps.js');
    showMaps();
  }
});


window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/single-map.html') {
    let {
      displayMap
    } = await import('./maps.js');
    displayMap();
  }
});


// Event listener for community page
window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/community.html') {
    let {
      community
    } = await import('./community.js');
    community();
  }
});

// Event listener for community page
window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/community-maps.html') {
    let {
      displayCommunityMap
    } = await import('./community.js');
    displayCommunityMap();
  }
});


// Event listener for profile page
window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/profile.html') {
    let {
      displayProfile
    } = await import('./user.js');
    displayProfile();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/maps-ridden.html') {
    let {
      displayRiddenMaps
    } = await import('./user.js');
    displayRiddenMaps();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/past-rides.html') {
    let {
      displayPastTour
    } = await import('./user.js');
    displayPastTour();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/planned-rides.html') {
    let {
      displayPlannedTour
    } = await import('./user.js');
    displayPlannedTour();
  }
});

let navProfile = document.getElementById('mobile-nav-profile');
if (navProfile) {
  navProfile.addEventListener('click', async () => {
    if (supa.auth.user() === null) {
      window.location.href = 'user-login.html';

    } else {
      window.location.href = 'profile.html';
    }
  });
}

let changeWording = document.querySelectorAll('.mobile-nav-description');

if (document.querySelector('.mobile-nav-description')) {
  if (supa.auth.user() === null) {
    changeWording[3].innerHTML = 'Login'
  }
}