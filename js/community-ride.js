// Import 'supa' object from '/js/supabase.js' module
import {
  supa
} from "/js/supabase.js";

// Define variables
let mapID = localStorage.getItem('mapId');
let selectedDate
let selectedTime

// Function to display map information
async function displayMap() {
  try {
    // Query 'maps' data from Supabase
    const {
      data: maps,
      error
    } = await supa.from("maps").select();
    if (error) {
      throw error;
    }

    maps.forEach(maps => {
      let mapInformation = document.querySelector('.map-information');
      mapInformation.id = maps.id;

      if (mapID == maps.id) {
        // Populate map information in HTML based on map ID
        mapInformation.innerHTML = `
        <div id="map" class="single-map-big"></div>
          <button id="shuffle-again">Nochmals mischen</button>
          <div class="container-flex">
            <div>
              <h2 id="single-map-name">${maps.map_name}</h2>
              <ul>
                <li class="maps-distance">
                  <img src="/img/icon-distance.svg" alt="image-alt">
                  <p>${maps.distance}km</p>
                </li>
                <li class="maps-distance">
                  <img src="/img/icon-up.svg" alt="image-alt">
                  <p>${maps.altitude_up}m</p>
                </li>
                <li class="maps-distance">
                  <img src="/img/icon-down.svg" alt="image-alt">
                  <p>${maps.altitude_down}m</p>
                </li>
              </ul>
              <div class="maps-filters ${maps.altitude}">${maps.altitude}</div>
            </div>
          </div>
        `;

        initMap = function () {
          const map = new google.maps.Map(document.getElementById("map"), {
            mapId: "67a32317a1bc4a60",
            zoom: 10,
            center: {
              lat: 46.946383444981336,
              lng: 7.442313596894101
            },
            mapTypeId: "roadmap",
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          });

          fetch(`https://jxqqxtyepipnutkjzefu.supabase.co/storage/v1/object/public/Maps${maps.gpx_data}`)
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            //.then(data => console.log(data))
            .then(doc => {
              var points = [];
              var bounds = new google.maps.LatLngBounds();

              const nodes = [...doc.getElementsByTagName('trkpt')];
              nodes.forEach(node => {
                var lat = node.getAttribute("lat");
                var lon = node.getAttribute("lon");
                //console.log(lat);

                var p = new google.maps.LatLng(lat, lon);
                points.push(p);
                bounds.extend(p);
              })

              var poly = new google.maps.Polyline({
                path: points,
                strokeColor: "#f99a52",
                strokeOpacity: 0.8,
                strokeWeight: 4
              });
              poly.setMap(map);
              // fit bounds to track
              map.fitBounds(bounds);
            })
        }
        // Initialize Google Maps
        initMap();

        let skeletonLoading = document.querySelector('.skeleton-loading');
        skeletonLoading.style.display = 'none';
      }
    });
  } catch (error) {
    console.error('Error fetching map data:', error.message);
  }

}


// Function to generate date dropdown
function generateDateDropdown() {
  let dateDropdown = document.getElementById('date-dropdown');

  dateDropdown.addEventListener('change', function () {
    selectedDate = new Date(this.value);
    generateTimeDropdown();
  });

  dateDropdown.innerHTML = '';

  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  let dateOptions = [{
      label: formatDate(today),
      value: today.toISOString().split('T')[0]
    },
    {
      label: formatDate(tomorrow),
      value: tomorrow.toISOString().split('T')[0]
    },
    {
      label: formatDate(dayAfterTomorrow),
      value: dayAfterTomorrow.toISOString().split('T')[0]
    }
  ];

  dateOptions.forEach(option => {
    let dateOption = document.createElement('option');
    dateOption.value = option.value;
    dateOption.textContent = option.label;
    dateDropdown.appendChild(dateOption);
  });

  // Set today's date as the default selected date
  selectedDate = today;
  dateDropdown.value = today.toISOString().split('T')[0];

  // Trigger the change event to update the selected time
  dateDropdown.dispatchEvent(new Event('change'));

}

// Function to generate time dropdown
function generateTimeDropdown() {
  let timeDropdown = document.getElementById('time-dropdown');
  timeDropdown.innerHTML = '';

  let now = new Date();
  let currentHour = now.getHours();
  let currentMinute = now.getMinutes();

  let startHour = 6;
  let endHour = 22;
  let startMinute = 0;

  //console.log(now.getDate() + 1)
  //console.log(selectedDate)
  //console.log(selectedDate.getDate())

  if (
    selectedDate &&
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear()
  ) {
    startHour = (currentHour < 22) ? currentHour : 22;
    if (currentMinute > 0 && currentMinute <= 45) {
      startMinute = Math.ceil(currentMinute / 15) * 15;
    } else if (currentMinute > 45) {
      startMinute = 0;
      startHour++;
    }
  } else if (
    selectedDate.getDate() === now.getDate() + 1 &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear()
  ) {
    // If tomorrow's date is selected, start from 06:00
    startHour = 6;
    endHour = 22;
  }

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = startMinute; minute < 60; minute += 30) {
      let option = document.createElement('option');
      let time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      option.value = time;
      option.textContent = time;
      timeDropdown.appendChild(option);
    }
    startMinute = 0; // Reset startMinute for the next hour
  }

  timeDropdown.addEventListener('change', function () {
    selectedTime = this.value;
  });

  if (timeDropdown.options[0]) {
    timeDropdown.value = timeDropdown.options[0].value;
    selectedTime = timeDropdown.value;
  }
}

// Event listener for "Plan Ride" button click
document.getElementById('btn-add-community').addEventListener('click', planRide);

// Function to plan a ride
function planRide() {
  // Check if date and time are selected
  if (selectedDate && selectedTime) {
    // Split the time string into hours and minutes
    let [hours, minutes] = selectedTime.split(":").map(Number);

    // Subtract 1 hour
    hours -= 1;

    // If hours goes below 0, wrap around to 23 (since it's a 24-hour format)
    if (hours < 0) {
      hours = 23;
    }

    // Format the result back into HH:mm format
    let convertedHour = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    // Create a new Date object with the selected date and time
    let rideDateTime = new Date(selectedDate);
    rideDateTime.setHours(hours, minutes);

    // Format the date-time in ISO 8601 format
    let formattedDateTime = rideDateTime.toISOString();

    // Assuming you have elements to capture map details
    let mapId = localStorage.getItem('mapId');

    // Save the ride details to the Supabase table 'tour_x'
    saveRideDetails(formattedDateTime, mapId);

    //console.log('Date:', rideDateTime);

  } else {
    console.log('Please select a date and time.');
  }

}


// Function to save ride details to the database
async function saveRideDetails(dateTime, mapId) {
  try {

    const originalDateTime = new Date(dateTime);

    // Add 1 hour to the dateTime
    const adjustedDateTime = new Date(originalDateTime.getTime() + 60 * 60 * 1000);

    const {
      data,
      error
    } = await supa
      .from('tour_x')
      .insert([{
        start_time: adjustedDateTime,
        user_id: supa.auth.user().id,
        maps_id: mapId
      }]);


    if (error) {
      throw error;
    } else {
      // Redirect to the 'my-rides.html' page
      window.location.href = '/community.html';
    }

    //console.log('Ride details saved successfully:', data);
  } catch (error) {
    console.error('Error saving ride details:', error.message);
  }
}

// Function to format date
function formatDate(date) {
  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString(undefined, options);
}

// Set button text and display style
document.querySelector('.btn-back').innerHTML = 'Zurück';
document.querySelector('#icon-chevron').style.display = 'block';

document.querySelector(".btn-back").addEventListener("click", () => {
  history.back();
});

// Initial function calls
displayMap();
generateDateDropdown();
generateTimeDropdown();


let submitButton = document.getElementById("btn-add-community");

document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
  let keyCode = e.keyCode;
  if (keyCode == 13) {
    submitButton.click();
  }
}