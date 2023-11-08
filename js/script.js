import { supa } from "/js/supabase.js";

// Get the current page URL and links
const currentUrl = window.location.href;
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

// Event listener for distance filter buttons
btnFilterDistance.forEach((btn) => {
  btn.addEventListener('click', () => {

    // Remove 'btn-filter-distance-active' class from other buttons
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

    console.log(localStorage.getItem('btnFilterDistance'))
  });
});

// Similar event listener for altitude filter buttons
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

// Activate a button as default if 'single-route' element is present
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
      window.location.href = '/single-map.html';

    } else {
      // Redirect to the overview-maps.html page
      window.location.href = 'overview-maps.html';
    }
  });
}

// Event listeners to dynamically load different JavaScript files based on page location
window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/overview-maps.html') {
    const { showMaps } = await import('./maps.js');
    showMaps();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/single-map.html') {
    const { shuffleMaps } = await import('./maps.js');
    shuffleMaps();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/single-map.html') {
    const { displayMap } = await import('./maps.js');
    displayMap();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/community.html') {
    const { community } = await import('./community.js');
    community();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/profile.html') {
    const { displayProfile } = await import('./user.js');
    displayProfile();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/maps-ridden.html') {
    const { displayRiddenMaps } = await import('./user.js');
    displayRiddenMaps();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/past-rides.html') {
    const { displayPastTour } = await import('./user.js');
    displayPastTour();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/planned-rides.html') {
    const { displayPlannedTour } = await import('./user.js');
    displayPlannedTour();
  }
});


// Event listener for Profile page
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
