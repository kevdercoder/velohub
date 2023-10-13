/*
 * This script fetches the current weather data from the OpenWeatherMap API.
 * It then displays the current temperature and weather image.
 */

const API_KEY = 'fcc3f6d978376e674cc87cad43d09e19';
const CITY = 'Bern';
const COUNTRY_CODE = 'CH';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    let currentTemp = Math.round(data.main.temp - 273.15);
    document.querySelector('#temp').innerHTML = currentTemp;


    // Get the current weather condition and icon
    const weatherCondition = data.weather[0].main;

    // Determine the daytime based on the current time and timezone offset
    const timezoneOffset = data.timezone;
    const currentTime = new Date();
    const localTime = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000) + (timezoneOffset * 1000);
    const localDate = new Date(localTime);
    const hours = localDate.getHours();
    const isDaytime = hours >= 6 && hours < 18;

    console.log(weatherCondition);

    // Set the weather icon based on the weather condition and daytime
    let iconUrl;
    if (weatherCondition === 'Clear') {
      iconUrl = isDaytime ? 'img/sun.png' : 'img/moon.svg';
    } else if (weatherCondition === 'Clouds') {
      iconUrl = isDaytime ? 'img/clouds-day.png' : 'img/clouds-night.svg';
    } else if (weatherCondition === 'Rain') {
      iconUrl = isDaytime ? 'img/rain-day.svg' : 'img/rain-night.svg';
    } else {
      iconUrl = 'img/default.png';
    }
    document.querySelector('#weather-icon').src = iconUrl;

  })
  .catch(error => {
    console.log(error);
  });


  /*
   * This script checks for the current URL and adds an id 
   * to the current link in the navigation menu
   */

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


/* 
 * This section handles the login and sign up functionality.
 * Aditionally it manages the current user status. 
 */

import {
  supa
} from "/js/supabase-setup.js";

// Attach event listeners to the login button
let submitLoginButton = document.getElementById('submit-login');
if (submitLoginButton) {
  submitLoginButton.addEventListener('click', login);
}

// Function to login using email and password
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { error } = await supa.auth.signIn({ email, password });

  if (error) {
      console.error("Error during login: ", error.message);
  } else {
      console.log("Logged in as ", email);
      window.location.href = 'profile.html';
  }
}

// Attach event listeners to the sign up buttons
let submitJoinButton = document.getElementById('submit-join');
if (submitJoinButton) {
  submitJoinButton.addEventListener('click', signUp);
}

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
    window.location.href = 'confirm-email.html';
    console.log("User signed up successfully:", user);

    //Insert the UUID of the user into the "user" table
    const { data, error } = await supa
      .from("user")
      .insert({
        user_id: user.id,
        first_name: firstName,
        name: name,
        email: email
      });

    if (error) {
      console.log("Error inserting data:", error.message);
    } else {
      console.log("Data inserted successfully:", data);
    }
  }
}

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



// Save the filter choice in local storage 
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
    } else {
      btn.classList.add('btn-filter-distance-active');
    }

    localStorage.setItem('btnFilterDistance', btn.id);
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
    } else {
      btn.classList.add('btn-filter-distance-active');
    }

    localStorage.setItem('btnFilterAltitude', btn.id);
    console.log(localStorage.getItem('btnFilterAltitude'))
  });
});

//activate button as default
if (document.contains(document.getElementById('single-route'))) {
  document.getElementById('single-route').classList.add('btn-filter-distance-active')
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

let btnSubmit = document.querySelector('.btn-submit');
if (btnSubmit) {
  btnSubmit.addEventListener('click', async () => {
    // Redirect to the overview-maps.html page
    window.location.href = 'overview-maps.html';
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
    const { displayMap } = await import('./maps.js');
     
    displayMap();
  }
});


let navProfile = document.getElementById('mobile-nav-profile');
if (navProfile) {
  navProfile.addEventListener('click', async () => {
    if(supa.auth.user() === null) {
      window.location.href = 'sign-in.html';
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


// Check if the user is on the index page and reset local storage
if (window.location.pathname === '/index.html') {
  localStorage.clear(); 
}