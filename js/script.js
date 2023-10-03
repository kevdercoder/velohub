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

import { supa } from "/js/supabase-setup.js";

async function selectUser() {
    const { data, error } = await supa.from("User").select("name")

   
  
    return data;
  }


  async function signUp() {
    const email = document.getElementById('join-email').value;
    const password = document.getElementById('join-password').value;
    const confirmPassword = document.getElementById('join-password-confirmation').value;
    const firstName = document.getElementById('join-firstname').value;
    const name = document.getElementById('join-name').value;

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }    
  
    const { user, error } = await supa.auth.signUp({ email, password });
  
    if (error) {
      console.error("Error during sign up: ", error.message);
    } else {
      // Add the user's name and first name to the "user_profile" table
      const { error } = await supa
        .from("user")
        .insert({ first_name: firstName, name: name, email: email, });
  
      if (error) {
        console.error("Error during user profile creation: ", error.message);
      } else {
        console.log("User signed up successfully:", user);
      }
    }
  }

  document.getElementById('submit-signin').addEventListener('click', signUp);