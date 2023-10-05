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
 * This script fetches the current weather data from the OpenWeatherMap API.
 * It then displays the current temperature and weather image.
 */

import {
  supa
} from "/js/supabase-setup.js";

// Function to sign up a new user
async function signUp() {
  const email = document.getElementById('join-email').value;
  const password = document.getElementById('join-password').value;
  const firstName = document.getElementById('join-firstname').value;
  const name = document.getElementById('join-name').value;

  const {
    user,
    error
  } = await supa.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error("Error during sign up: ", error.message);
  } else {
    console.log("User signed up successfully:", user);

    console.log(user.id)

    // Insert the UUID of the user into the "user" table
    const {
      data,
      error
    } = await supa
      .from("user")
      .insert({
        user_id: user.id,
        first_name: firstName,
        name: name,
        email: email
      });

    if (error) {
      console.error("Error during user creation: ", error.message);
    } else {
      console.log("User created successfully:", data[0]);
    }
  }
}


// Function to login using email and password
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const {
    error
  } = await supa.auth.signIn({
    email,
    password
  });

  if (error) {
    console.error("Error during login: ", error.message);
  } else {
    console.log("Logged in as ", email);
  }
}

// Attach event listeners to the login and sign up buttons
let submitJoinButton = document.getElementById('submit-join');
if (submitJoinButton) {
  submitJoinButton.addEventListener('click', signUp);
}

let submitLoginButton = document.getElementById('submit-login');
if (submitLoginButton) {
  submitLoginButton.addEventListener('click', login);
}

const {
  user
} = supa.auth.user();

if (user) {
  console.log("Logged in as:", user.email);
  console.log("User ID:", user.id);
  console.log("User profile:", user.user_metadata);
} else {
  console.log("No user is currently logged in.");
}

let btnSubmit = document.querySelector('.btn-submit');
if (btnSubmit) {
  btnSubmit.addEventListener('click', async () => {
    // Pass data via URL parameter
    window.location.href = 'overview-maps.html?loadData=true';
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const loadData = urlParams.get('loadData');

  if (loadData === 'true') {
    await showMaps();
  }
});

async function showMaps() {
  const ul = document.querySelector('#test');
  const {
    data: maps,
    error
  } = await supa.from("maps").select();
  maps.forEach(maps => {
    const section = document.createElement('section');
    section.innerHTML = `
  <div>
    <img src="${maps.map_img}" alt="image-alt">
    </div>
    <div>
      <h2>${maps.map_name}</h2>
      <ul>
        <li>
          <img src="/img/icon-distance.svg" alt="image-alt">
          <p>${maps.distance}</p>
        </li>
        <li>
          <img src="/img/icon-up.svg" alt="image-alt">
          <p>${maps.altitude_up}</p>
        </li>
        <li>
          <img src="/img/icon-down.svg" alt="image-alt">
          <p>${maps.altitude_down}</p>
        </li>
      </ul>
  </div>
  <div>${maps.filter}</div>
`;

    document.body.appendChild(section);
  })
}